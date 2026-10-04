// ARCHIVO: scripts/modules/render.js
// QUÉ HACE: dibuja el estado del juego en el DOM (corazones, casillas de la palabra, contadores,
// tabla de ranking, diálogo de resultado y avisos). No habla con el servidor ni decide reglas:
// solo recibe datos y los muestra. Siempre uso textContent y createElement (nunca innerHTML)
// para que un nombre malicioso como "<script>" se muestre como texto y no se ejecute (evita XSS).

// Trazado SVG de un corazón (atributo "d" de un <path>): son comandos de dibujo en un lienzo de 24x24.
const CORAZON = "M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.2 1.8-2 3.3-3.2 5.4-3.2 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21Z";

// Helper: crea un elemento con clase y texto opcionales para no repetir tres líneas cada vez.
function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta); // Creo la etiqueta (span, td, tr...).
  if (clase) elemento.className = clase; // Si me pasaron clase CSS, se la pongo.
  if (texto !== undefined) elemento.textContent = texto; // Si me pasaron texto, lo escribo de forma segura.
  return elemento;
}

// Convierte segundos en "mm:ss" (ej. 75 → "01:15").
export function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60); // Minutos completos.
  return `${String(minutos).padStart(2, "0")}:${String(segundos % 60).padStart(2, "0")}`; // padStart completa con ceros a la izquierda; % da los segundos restantes.
}

// Dibujo un corazón por intento; los perdidos quedan vacíos.
export function renderVidas(restantes, total = 6) {
  const contenedor = document.querySelector("#vidas"); // Caja donde van los corazones.
  contenedor.replaceChildren(...Array.from({ length: total }, (_, i) => { // Creo "total" corazones; "i" es el número de corazón.
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); // Los SVG requieren su "namespace" propio.
    svg.setAttribute("viewBox", "0 0 24 24"); // Sistema de coordenadas del dibujo.
    svg.setAttribute("aria-hidden", "true"); // Es decorativo: el lector de pantalla lee el aria-label del contenedor.
    const camino = document.createElementNS("http://www.w3.org/2000/svg", "path"); // Forma del corazón.
    camino.setAttribute("d", CORAZON); // Le asigno el trazado.
    svg.append(camino);
    if (i >= restantes) svg.classList.add("perdida"); // Los que superan las vidas restantes se ven vacíos.
    return svg;
  }));
  contenedor.setAttribute("aria-label", `${restantes} de ${total} vidas`); // Texto accesible: "4 de 6 vidas".
}

// Muestro las casillas sin insertar HTML. Las letras nuevas se voltean y, al perder, aparecen las que faltaban.
export function renderPartida(partida, anterior = null) { // "anterior" es el estado previo (sirve para animar solo lo que cambió).
  const palabra = document.querySelector("#palabra-oculta"); // Contenedor de las casillas.
  const final = partida.palabra ? [...partida.palabra] : null; // La palabra completa solo llega cuando la partida terminó.
  palabra.replaceChildren(...partida.letras.map((letra, i) => { // Una casilla por posición de la palabra.
    const casilla = crear("span", "casilla");
    if (letra) { // Letra ya descubierta.
      casilla.textContent = letra;
      casilla.classList.add("descubierta"); // Subrayado azul.
      if (anterior && !anterior.letras[i]) casilla.classList.add("revelada"); // Si antes estaba oculta, se anima con un giro.
    } else if (final) { // Partida perdida: muestro en rojo las letras que faltaron.
      casilla.textContent = final[i];
      casilla.classList.add("faltante");
    }
    return casilla;
  }));
  const ocultas = partida.letras.filter((letra) => !letra).length; // Cuántas letras siguen ocultas.
  palabra.setAttribute("aria-label", `Palabra de ${partida.letras.length} letras, faltan ${ocultas}`); // Descripción para lectores de pantalla.
  palabra.classList.toggle("ganada", partida.estado === "ganada"); // Activa la animación de festejo.

  if (anterior && partida.errores > anterior.errores && partida.estado === "jugando") { // Si hubo un error nuevo...
    palabra.classList.remove("sacudir"); // ...reinicio la animación de sacudida:
    void palabra.offsetWidth; // leer offsetWidth fuerza al navegador a "recalcular" y permite repetir la animación.
    palabra.classList.add("sacudir");
  }

  renderVidas(partida.intentosRestantes, partida.maxIntentos); // Actualizo los corazones.
  const categoria = document.querySelector("#categoria"); // Etiqueta con la categoría.
  categoria.hidden = !partida.categoria; // Se oculta en modo dos jugadores (no hay categoría).
  categoria.textContent = partida.categoria || "";
  document.querySelector("#reloj").textContent = formatearTiempo(partida.tiempo); // Reloj con el tiempo del servidor.
}

export function renderEstado(texto) { // Frase de estado bajo la escena ("Faltan 3 letras · 5 vidas").
  document.querySelector("#estado").textContent = texto;
}

export function renderEstadisticas(datos) { // Contadores de la barra superior.
  document.querySelector("#stat-ganadas").textContent = datos.ganadas;
  document.querySelector("#stat-racha").textContent = datos.racha;
  document.querySelector("#stat-mejor").textContent = datos.mejorRacha;
}

// Muestro un mensaje dentro de la tabla (vacía o con error de conexión).
export function renderMensajeTabla(texto) {
  const fila = crear("tr"); // Una fila...
  const celda = crear("td", "vacio", texto); // ...con una celda de texto...
  celda.colSpan = 5; // ...que ocupa las 5 columnas.
  fila.append(celda);
  document.querySelector("#filas-puntaje").replaceChildren(fila); // Reemplaza todo el contenido del <tbody>.
}

// Construyo filas seguras para la tabla; resalto el puntaje recién guardado.
export function renderPuntajes(puntajes, idNuevo = null) {
  const cuerpo = document.querySelector("#filas-puntaje"); // <tbody> de la tabla.
  if (puntajes.length === 0) { // Sin datos: aviso amable.
    renderMensajeTabla("Todavía no hay puntajes. ¡Sé el primero!");
    return;
  }
  cuerpo.replaceChildren(...puntajes.map((puntaje, indice) => { // Una fila por puntaje (map transforma cada dato en un elemento).
    const fila = crear("tr", puntaje.id === idNuevo ? "nuevo" : ""); // La fila recién guardada se resalta.
    const posicion = crear("td");
    posicion.append(crear("span", "posicion", indice + 1)); // Número de puesto (1, 2, 3...) con insignia.
    fila.append(
      posicion,
      crear("td", "", puntaje.nombre), // Nombre como texto: nunca se interpreta como HTML.
      crear("td", "", puntaje.puntos),
      crear("td", "", formatearTiempo(puntaje.tiempo)),
      crear("td", "", new Date(puntaje.fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })) // Fecha corta dd/mm.
    );
    return fila;
  }));
}

// Lleno el diálogo de fin de partida con el resultado.
export function renderResultado(partida) {
  const dialogo = document.querySelector("#resultado"); // Elemento <dialog>.
  const gano = partida.estado === "ganada";
  dialogo.classList.toggle("gano", gano); // Clase para colorear el título en verde...
  dialogo.classList.toggle("perdio", !gano); // ...o en rojo.
  document.querySelector("#resultado-eyebrow").textContent = gano ? "¡LO SALVASTE!" : "FIN DE PARTIDA";
  document.querySelector("#resultado-titulo").textContent = gano ? "¡Ganaste!" : "Perdiste";
  document.querySelector("#resultado-palabra").textContent = partida.palabra; // Siempre disponible: la partida ya terminó.
  document.querySelector("#resultado-puntos").textContent = partida.puntos;
  document.querySelector("#resultado-tiempo").textContent = formatearTiempo(partida.tiempo);
  document.querySelector("#resultado-errores").textContent = `${partida.errores}/${partida.maxIntentos}`; // Ej.: "3/6".
  document.querySelector("#form-puntaje").hidden = !gano; // Solo el que ganó puede guardar su nombre.
}

let temporizadorAviso; // Guarda el id del setTimeout para poder cancelarlo si llega otro aviso.

// Muestro un aviso flotante que se oculta solo.
export function mostrarAviso(mensaje, tipo = "info") { // tipo: "info", "error" o "exito" (cambia el borde).
  const aviso = document.querySelector("#aviso");
  aviso.className = `aviso ${tipo}`; // Clases CSS según el tipo.
  aviso.textContent = mensaje;
  aviso.hidden = false; // Lo muestro.
  clearTimeout(temporizadorAviso); // Cancelo el temporizador anterior para no ocultar el aviso nuevo antes de tiempo.
  temporizadorAviso = setTimeout(() => { aviso.hidden = true; }, 3200); // Se oculta a los 3,2 segundos.
}
