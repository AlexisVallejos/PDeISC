// ARCHIVO: scripts/main.js
// QUÉ HACE: es el "director" del frontend. Conecta los eventos (clicks, teclas, formularios) con la
// API (api.js), el dibujo del DOM (render.js), el teclado (teclado.js), las estadísticas, el tema
// y la escena 3D. Guarda en memoria el estado de la partida actual y decide qué mostrar en cada paso.

import { iniciarTema, temaOscuro } from "../Context/tema.js"; // Tema claro/oscuro.
import * as api from "./modules/api.js"; // Todas las llamadas al servidor, agrupadas bajo "api".
import { leerEstadisticas, registrarResultado } from "./modules/estadisticas.js"; // Ganadas, racha y mejor racha.
import {
  formatearTiempo, mostrarAviso, renderEstadisticas, renderEstado, renderMensajeTabla, renderPartida,
  renderPuntajes, renderResultado, renderVidas
} from "./modules/render.js"; // Funciones que dibujan en pantalla.
import { actualizarTeclado, crearTeclado, marcarTecla } from "./modules/teclado.js"; // Teclado en pantalla.
import { normalizarLetra, validarNombreFront, validarPalabraFront } from "./modules/validaciones.js"; // Validaciones del navegador.

const $ = (selector) => document.querySelector(selector); // Atajo: $("#id") en lugar de document.querySelector("#id").
const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)"); // true si el usuario pidió menos animaciones en su sistema.

let partidaActual = null; // Última vista de la partida que mandó el servidor.
let puntajeGuardado = false; // Evita guardar dos veces el mismo puntaje.
let ocupado = false; // true mientras hay una petición en curso (evita jugadas simultáneas).
let temporizador = null; // Id del setInterval del reloj.

// Mientras carga Three.js (o si falla) uso una escena "vacía" para que el juego funcione igual.
const escenaVacia = { // Objeto "de mentira" con los mismos métodos que la escena real, pero que no hacen nada.
  aplicarTema() {}, preparar() {}, esperar() {}, mostrarErrores() {}, reaccionar() {},
  perder: async () => {}, ganar: async () => {}, describir: () => "Escena 3D no disponible"
};
let escena = escenaVacia; // Escena activa; se reemplaza por la real cuando termina de cargar.

function describirEscena() { // Actualiza el texto accesible del lienzo 3D.
  $("#escena3d").setAttribute("aria-label", escena.describir());
}

// Cargo la escena 3D aparte: si el CDN o WebGL fallan, el resto de la página sigue andando.
async function cargarEscena() {
  try {
    const { crearEscena } = await import("./modules/escena3d.js"); // Import dinámico: descarga Three.js recién ahora, sin bloquear la página.
    escena = crearEscena($("#escena3d")); // Creo la escena dentro del contenedor.
    escena.aplicarTema(temaOscuro()); // Arranca con los colores del tema actual.
    if (partidaActual?.estado === "jugando") { // Si el usuario ya empezó a jugar mientras cargaba...
      escena.preparar(); // ...muestro el muñeco fantasma...
      escena.mostrarErrores(partidaActual.errores, false); // ...con los errores ya cometidos, sin animar.
    } else {
      escena.esperar(); // Si no, el muñeco saluda esperando partida.
    }
    describirEscena();
  } catch (error) {
    console.error("No se pudo iniciar la escena 3D:", error); // Detalle técnico en la consola.
    $("#sin-3d").hidden = false; // Muestro el cartel de "no se pudo cargar la escena".
    $(".lienzo-pista").hidden = true; // Oculto "Arrastrá para girar", que ya no aplica.
  }
}

async function actualizarTabla(idNuevo = null) { // Pide el ranking y lo dibuja; idNuevo resalta el puntaje recién guardado.
  try {
    const datos = await api.cargarPuntajes();
    renderPuntajes(datos.puntajes, idNuevo);
  } catch {
    renderMensajeTabla("No se pudo leer el ranking. Probá con el botón de actualizar."); // Mensaje dentro de la tabla, sin romper el juego.
  }
}

async function cargarCategorias() { // Llena el <select> con las categorías del servidor.
  try {
    const { categorias } = await api.cargarCategorias();
    const select = $("#categoria-select");
    categorias.forEach(({ id, nombre }) => select.append(new Option(nombre, id))); // new Option(texto, valor) crea un <option>.
  } catch {
    // Si no llegan, queda "Todas mezcladas" y el servidor elige igual.
  }
}

function modoElegido() { // Devuelve "azar" o "duelo" según el radio marcado.
  return document.querySelector('input[name="modo"]:checked').value;
}

function iniciarReloj() { // Reloj en vivo que se actualiza cada segundo.
  clearInterval(temporizador); // Cancelo el reloj anterior si lo había.
  const inicio = Date.now(); // Momento de arranque.
  temporizador = setInterval(() => { // Cada 1000 ms recalculo y muestro el tiempo transcurrido.
    $("#reloj").textContent = formatearTiempo(Math.floor((Date.now() - inicio) / 1000));
  }, 1000);
}

function controlesDePartida(activos) { // Habilita o deshabilita Pista y Rendirse.
  $("#pista").disabled = !activos || partidaActual.intentosRestantes <= 1; // Sin pista si queda una sola vida (el servidor también lo impide).
  $("#rendirse").disabled = !activos;
}

function textoEnJuego(partida) { // Frase de estado durante la partida.
  const faltan = partida.letras.filter((letra) => !letra).length; // Casillas aún vacías.
  const vidas = partida.intentosRestantes === 1 ? "¡última vida!" : `${partida.intentosRestantes} vidas`;
  return `Faltan ${faltan} ${faltan === 1 ? "letra" : "letras"} · ${vidas}`; // Singular/plural correcto.
}

// Arranco una partida nueva en el modo elegido.
async function empezar(evento) {
  evento?.preventDefault(); // Evito que el formulario recargue la página (el "?." permite llamarla sin evento).
  const modo = modoElegido();
  const datos = { modo }; // Cuerpo de la petición.
  if (modo === "duelo") { // Dos jugadores: hay que validar la palabra escrita.
    const campo = $("#palabra");
    if (!validarPalabraFront(campo.value)) { // Validación inmediata en el navegador.
      campo.setAttribute("aria-invalid", "true"); // Marca el campo como inválido (también para lectores de pantalla).
      $("#error-palabra").textContent = "Usá de 3 a 20 letras, sin espacios ni símbolos.";
      campo.focus(); // Llevo el cursor al campo con error.
      return; // No sigo.
    }
    datos.palabra = campo.value;
  } else {
    datos.categoria = $("#categoria-select").value; // Al azar: mando la categoría elegida ("" = todas).
  }

  const boton = $("#empezar");
  boton.disabled = true; // Deshabilito el botón para evitar doble envío.
  try {
    const { partida } = await api.iniciarPartida(datos); // Pido la partida al servidor.
    partidaActual = partida; // Guardo el estado inicial.
    puntajeGuardado = false; // Es una partida nueva: todavía no se guardó puntaje.
    colaLetras.length = 0; // Vacío letras pendientes de la partida anterior.
    $("#palabra").value = ""; // Borro la palabra secreta del campo para que el otro jugador no la vea.
    $("#palabra").removeAttribute("aria-invalid");
    $("#error-palabra").textContent = "";
    escena.preparar(); // Muñeco fantasma sobre el taburete.
    describirEscena();
    renderPartida(partida); // Dibujo las casillas vacías.
    actualizarTeclado($("#teclado"), partida); // Habilito el teclado.
    controlesDePartida(true); // Habilito Pista y Rendirse.
    iniciarReloj();
    renderEstado(`Palabra de ${partida.letras.length} letras${partida.categoria ? ` · ${partida.categoria}` : ""}. ¡Salvalo!`);
    // En pantallas chicas el escenario queda arriba: lo traigo a la vista.
    if (window.matchMedia("(max-width: 1080px)").matches) { // Solo en pantallas donde el panel está debajo del juego.
      $("#juego").scrollIntoView({ behavior: reducirMovimiento.matches ? "auto" : "smooth", block: "start" }); // Scroll suave, salvo que el usuario pida menos movimiento.
    }
  } catch (error) {
    mostrarAviso(error.message, "error"); // Muestro el mensaje de error del servidor.
  } finally {
    boton.disabled = false; // Siempre rehabilito el botón, haya salido bien o mal.
  }
}

// Aplico una respuesta del servidor: casillas, teclado, escena y fin de partida.
function aplicarJugada(partida, mensajeEnJuego) {
  const anterior = partidaActual; // Estado previo, para comparar qué cambió.
  partidaActual = partida; // Guardo el nuevo.
  renderPartida(partida, anterior); // Redibujo casillas, vidas y reloj.
  actualizarTeclado($("#teclado"), partida); // Pinto aciertos y fallos.
  escena.mostrarErrores(partida.errores); // El muñeco muestra una parte más por cada error.
  if (partida.estado === "jugando") { // La partida sigue.
    escena.reaccionar(partida.errores > anterior.errores ? "error" : "acierto"); // El muñeco reacciona según si hubo error.
    renderEstado(mensajeEnJuego ?? textoEnJuego(partida)); // Uso el mensaje recibido o el genérico (?? solo reemplaza null/undefined).
    controlesDePartida(true);
  } else {
    terminar(partida); // Ganó o perdió: cierro la partida.
  }
  describirEscena();
}

// Letras que se apretaron mientras el servidor respondía la anterior: se juegan en orden, no se pierden.
const colaLetras = [];

async function jugar(letra) {
  if (!partidaActual || partidaActual.estado !== "jugando") return; // Sin partida activa no hay nada que jugar.
  if (ocupado) { // Hay una petición en curso: guardo la letra en la cola.
    if (!colaLetras.includes(letra)) colaLetras.push(letra); // Sin duplicados.
    return;
  }
  if (partidaActual.letrasUsadas.includes(letra)) { // Letra repetida: aviso sin molestar al servidor.
    mostrarAviso(`Ya probaste la ${letra}.`);
  } else {
    ocupado = true; // Bloqueo nuevas jugadas hasta tener respuesta.
    try {
      const { partida } = await api.enviarLetra(partidaActual.id, letra); // Mando la letra al servidor.
      const acerto = partida.aciertos.includes(letra); // ¿La letra está en la palabra?
      aplicarJugada(partida, `${acerto ? `¡Bien! La ${letra} está.` : `La ${letra} no está.`} ${textoEnJuego(partida)}`);
    } catch (error) {
      mostrarAviso(error.message, "error");
    } finally {
      ocupado = false; // Libero el bloqueo siempre.
    }
  }
  if (colaLetras.length) jugar(colaLetras.shift()); // Si quedaron letras en cola, juego la primera (shift la saca del array).
}

async function usarPista() {
  if (!partidaActual || ocupado) return;
  ocupado = true;
  try {
    const { partida } = await api.pedirPista(partidaActual.id); // El servidor elige la letra y descuenta una vida.
    aplicarJugada(partida, `Pista: apareció la ${partida.letraPista}. ${textoEnJuego(partida)}`);
  } catch (error) {
    mostrarAviso(error.message, "error");
  } finally {
    ocupado = false;
  }
}

async function abandonar() {
  if (!partidaActual || ocupado) return;
  ocupado = true;
  try {
    const { partida } = await api.rendirse(partidaActual.id); // El servidor cierra la partida como perdida.
    aplicarJugada(partida);
  } catch (error) {
    mostrarAviso(error.message, "error");
  } finally {
    ocupado = false;
  }
}

// Cierro la partida: estadísticas, animación 3D y después el diálogo con el resultado.
async function terminar(partida) {
  clearInterval(temporizador); // Detengo el reloj en vivo.
  $("#reloj").textContent = formatearTiempo(partida.tiempo); // Muestro el tiempo final exacto del servidor.
  controlesDePartida(false); // Deshabilito Pista y Rendirse.
  const gano = partida.estado === "ganada";
  renderEstadisticas(registrarResultado(gano)); // Actualizo y muestro ganadas y racha.
  renderEstado(gano ? `¡Lo salvaste! ${partida.puntos} puntos.` : `Perdiste. La palabra era ${partida.palabra}.`);
  renderResultado(partida); // Preparo el contenido del diálogo (todavía cerrado).
  $("#nombre").value = ""; // Limpio el campo de nombre.
  $("#error-nombre").textContent = "";
  const animacion = gano ? escena.ganar() : escena.perder(); // Inicio la animación final del muñeco (devuelve una promesa).
  await Promise.race([animacion, new Promise((resolver) => setTimeout(resolver, reducirMovimiento.matches ? 200 : 1600))]); // Espero a que termine la animación, pero máximo 1,6 s: el diálogo no se hace esperar demasiado.
  describirEscena();
  if (partidaActual !== partida) return; // Si mientras tanto empezó otra partida, no muestro el diálogo viejo.
  $("#resultado").showModal(); // Abre el <dialog> como ventana modal (bloquea el resto y atrapa el foco).
  (gano ? $("#nombre") : $("#otra-vez")).focus(); // Foco en el campo de nombre si ganó, o en "Jugar otra vez" si perdió.
}

async function guardar(evento) { // Guarda el puntaje en el ranking.
  evento.preventDefault(); // No recargar la página.
  const campo = $("#nombre");
  if (!validarNombreFront(campo.value)) { // Validación del navegador.
    campo.setAttribute("aria-invalid", "true");
    $("#error-nombre").textContent = "Usá un nombre de 2 a 40 letras.";
    campo.focus();
    return;
  }
  if (puntajeGuardado) return; // Ya se guardó: ignoro clicks repetidos.
  const boton = $("#guardar");
  boton.disabled = true;
  try {
    const { puntaje } = await api.guardarPuntaje(campo.value, partidaActual.id); // Mando nombre e id de partida.
    puntajeGuardado = true;
    campo.removeAttribute("aria-invalid");
    $("#form-puntaje").hidden = true; // Oculto el formulario: ya cumplió su función.
    mostrarAviso("Puntaje guardado en el ranking.", "exito");
    $("#otra-vez").focus(); // Paso el foco al siguiente paso lógico.
    await actualizarTabla(puntaje.id); // Recargo el ranking resaltando la fila nueva.
  } catch (error) {
    $("#error-nombre").textContent = error.message; // El error se muestra junto al campo.
  } finally {
    boton.disabled = false;
  }
}

// "Jugar otra vez": al azar arranca enseguida; en duelo vuelve al formulario para otra palabra.
function otraVez() {
  $("#resultado").close(); // Cierro el diálogo.
  if (modoElegido() === "azar") {
    empezar(); // Nueva palabra al azar inmediatamente.
    return;
  }
  escena.esperar(); // En duelo el muñeco vuelve a saludar...
  describirEscena();
  $("#palabra").focus(); // ...y el cursor va al campo para que el otro jugador escriba una palabra.
}

// Teclado físico: letras juegan, salvo que el foco esté en un campo o haya un diálogo abierto.
function manejarTeclaFisica(evento) {
  if (evento.ctrlKey || evento.metaKey || evento.altKey || evento.repeat) return; // Ignoro atajos (Ctrl+C...) y teclas mantenidas.
  if (evento.target.closest("input, select, textarea") || $("#resultado").open) return; // Si el usuario está escribiendo en un campo o hay diálogo, no juego.
  const letra = normalizarLetra(evento.key); // Convierto la tecla en letra válida (o null).
  if (!letra || partidaActual?.estado !== "jugando") return; // Solo letras y solo con partida en curso.
  evento.preventDefault(); // Evito el comportamiento por defecto de la tecla.
  marcarTecla($("#teclado"), letra); // Hundo visualmente la tecla en pantalla.
  jugar(letra);
}

function cambiarModo() { // Muestra el campo correcto según el modo.
  const duelo = modoElegido() === "duelo";
  $("#campo-palabra").hidden = !duelo; // La palabra secreta solo en dos jugadores.
  $("#campo-categoria").hidden = duelo; // La categoría solo al azar.
}

function conectarEventos() { // Asocia cada evento del DOM con su función.
  $("#form-partida").addEventListener("submit", empezar); // Enviar el formulario = empezar partida (funciona también con Enter).
  document.querySelectorAll('input[name="modo"]').forEach((radio) => radio.addEventListener("change", cambiarModo)); // Cambiar de modo actualiza el formulario.
  $("#pista").addEventListener("click", usarPista);
  $("#rendirse").addEventListener("click", abandonar);
  $("#form-puntaje").addEventListener("submit", guardar);
  $("#otra-vez").addEventListener("click", otraVez);
  $("#cerrar-resultado").addEventListener("click", () => $("#resultado").close()); // "Ver escena": solo cierra el diálogo.
  $("#actualizar").addEventListener("click", () => actualizarTabla()); // Botón de refrescar el ranking.
  document.addEventListener("keydown", manejarTeclaFisica); // Escucho el teclado en toda la página.
  document.addEventListener("tema-cambiado", (evento) => escena.aplicarTema(evento.detail.oscuro)); // Evento propio de tema.js: recoloreo la escena 3D.

  $("#ver-palabra").addEventListener("click", (evento) => { // Botón del "ojo" para mostrar/ocultar la palabra secreta.
    const campo = $("#palabra");
    const mostrar = campo.type === "password"; // Si está oculta, la voy a mostrar.
    campo.type = mostrar ? "text" : "password"; // Cambiar el type alterna entre puntos y texto.
    evento.currentTarget.setAttribute("aria-pressed", String(mostrar)); // Estado del botón para lectores de pantalla.
    evento.currentTarget.setAttribute("aria-label", mostrar ? "Ocultar palabra" : "Mostrar palabra");
  });

  $("#palabra").addEventListener("input", (evento) => { // Validación en vivo mientras se escribe la palabra.
    const valor = evento.target.value;
    const invalido = valor.length > 0 && !validarPalabraFront(valor); // No marco error con el campo vacío.
    evento.target.setAttribute("aria-invalid", String(invalido));
    $("#error-palabra").textContent = invalido ? "Solo letras, entre 3 y 20." : "";
  });

  $("#nombre").addEventListener("input", (evento) => { // Validación en vivo del nombre.
    const invalido = evento.target.value.length > 0 && !validarNombreFront(evento.target.value);
    evento.target.setAttribute("aria-invalid", String(invalido));
    $("#error-nombre").textContent = invalido ? "Usá entre 2 y 40 letras." : "";
  });
}

function iniciarAplicacion() { // Se ejecuta una vez al cargar: deja todo listo.
  iniciarTema(); // Aplica el tema claro/oscuro.
  crearTeclado($("#teclado"), jugar); // Construye las teclas; cada una llama a jugar(letra).
  actualizarTeclado($("#teclado"), null); // Teclado bloqueado hasta que haya partida.
  renderVidas(6); // Seis corazones llenos.
  renderEstadisticas(leerEstadisticas()); // Estadísticas guardadas en el navegador.
  conectarEventos();
  cambiarModo(); // Ajusta qué campo se ve según el modo inicial.
  cargarCategorias(); // Pide las categorías al servidor.
  actualizarTabla(); // Pide el ranking.
  cargarEscena(); // Carga la escena 3D sin bloquear lo demás.
}

iniciarAplicacion(); // Arranque.
