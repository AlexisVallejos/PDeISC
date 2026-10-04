// ARCHIVO: modules/juego.js
// QUÉ HACE: es la lógica del ahorcado y vive 100 % en el servidor. Guarda las partidas en memoria,
// decide si una letra acierta, cuenta errores, calcula puntos y tiempo, y arma la "vista" que se
// manda al navegador. La palabra secreta NUNCA sale mientras la partida está en curso.

import { randomUUID } from "node:crypto"; // Genera ids únicos imposibles de adivinar para cada partida.
import { NOMBRES_CATEGORIAS, palabraAlAzar } from "./palabras.js"; // Banco de palabras y nombres de categorías.
import { letraBase, validarLetra, validarPalabra } from "./validaciones.js"; // Validaciones y normalización de letras.

const partidas = new Map(); // Map: id de partida → objeto Partida. Vive en memoria (se pierde si se reinicia Node).
const MAX_INTENTOS = 6; // Errores permitidos: cabeza, torso, dos brazos y dos piernas.
const VIDA_PARTIDA_MS = 60 * 60 * 1000; // Una hora en milisegundos: después se borran las partidas viejas.

class Partida { // Clase que agrupa el estado de UNA partida y sus métodos.
  constructor(palabra, modo, categoria = null) { // Se ejecuta con "new Partida(...)".
    this.id = randomUUID(); // Identificador único de la partida.
    this.palabra = palabra; // Palabra secreta (ya validada y en mayúsculas).
    this.modo = modo; // "azar" (la elige el servidor) o "duelo" (la escribe otro jugador).
    this.categoria = categoria; // Id de la categoría; null en modo duelo.
    this.letras = new Set(); // Letras ya probadas (sin tilde). Set evita repetidos automáticamente.
    this.errores = 0; // Cantidad de errores cometidos.
    this.pistas = 0; // Cantidad de pistas usadas.
    this.inicio = Date.now(); // Momento de inicio en milisegundos (para calcular el tiempo).
    this.fin = null; // Momento de fin; null mientras se juega.
    this.estado = "jugando"; // Estados posibles: "jugando", "ganada" o "perdida".
  }

  // Comparo sin tildes: probar "A" también descubre "Á". La Ñ sigue siendo una letra propia.
  contiene(letra) {
    return [...this.palabra].some((item) => letraBase(item) === letra); // [...texto] separa en letras; some() es true si alguna coincide.
  }

  completa() {
    return [...this.palabra].every((item) => this.letras.has(letraBase(item))); // every() es true si TODAS las letras ya fueron probadas.
  }

  // Cierro la partida si se descubrió la palabra o se acabaron los intentos.
  actualizarEstado() {
    if (this.completa()) this.estado = "ganada"; // Descubrió todo: gana.
    else if (this.errores >= MAX_INTENTOS) this.estado = "perdida"; // Se quedó sin intentos: pierde.
    if (this.estado !== "jugando") this.fin = Date.now(); // Si terminó, congelo el reloj.
  }

  // Armo una vista segura para el navegador. La palabra solo viaja cuando la partida terminó.
  ver() {
    const usadas = [...this.letras]; // Convierto el Set en array para poder filtrarlo.
    return {
      id: this.id, // El navegador necesita el id para las siguientes peticiones.
      modo: this.modo, // Modo de juego.
      categoria: this.categoria ? NOMBRES_CATEGORIAS[this.categoria] : null, // Nombre legible de la categoría, o null.
      letras: [...this.palabra].map((letra) => this.letras.has(letraBase(letra)) ? letra : ""), // Una casilla por letra: la letra si ya se descubrió, "" si sigue oculta.
      letrasUsadas: usadas, // Todas las letras probadas.
      aciertos: usadas.filter((letra) => this.contiene(letra)), // Las que estaban en la palabra (para pintar el teclado en verde).
      fallos: usadas.filter((letra) => !this.contiene(letra)), // Las que no estaban (para pintarlas en rojo).
      errores: this.errores, // Errores acumulados.
      maxIntentos: MAX_INTENTOS, // Total de intentos (el cliente dibuja esa cantidad de corazones).
      intentosRestantes: MAX_INTENTOS - this.errores, // Vidas que quedan.
      pistas: this.pistas, // Pistas usadas.
      estado: this.estado, // Estado actual.
      puntos: this.estado === "ganada" ? Math.max(10, 100 - this.errores * 10) : 0, // 100 puntos menos 10 por error, con mínimo 10; solo si ganó.
      tiempo: Math.max(1, Math.floor(((this.fin || Date.now()) - this.inicio) / 1000)), // Segundos transcurridos, al menos 1.
      palabra: this.estado === "jugando" ? null : this.palabra // Seguridad: la palabra solo se revela cuando ya terminó.
    };
  }
}

// Borro partidas viejas para que el Map no crezca sin límite.
function limpiarPartidas() {
  const limite = Date.now() - VIDA_PARTIDA_MS; // Todo lo iniciado antes de este instante está vencido.
  partidas.forEach((partida, id) => { // Recorro el Map: forEach entrega (valor, clave).
    if (partida.inicio < limite) partidas.delete(id); // Borrar durante el recorrido es seguro en un Map.
  });
}

// Inicio una partida con una palabra propia o una del banco, sin exponerla en la respuesta.
export function crearPartida({ palabra, modo, categoria } = {}) { // Desestructuro el cuerpo; "= {}" evita errores si no llega nada.
  limpiarPartidas(); // Aprovecho para limpiar la memoria cada vez que alguien empieza.
  let partida; // Se asigna en uno de los dos caminos.
  if (modo === "azar") { // Modo al azar: elige el servidor.
    const elegida = palabraAlAzar(categoria); // Devuelve { palabra, categoria }.
    partida = new Partida(elegida.palabra, "azar", elegida.categoria);
  } else { // Cualquier otro modo se trata como duelo entre dos jugadores.
    const validacion = validarPalabra(palabra); // Reviso que la palabra sea válida.
    if (validacion.error) return { error: validacion.error }; // Si no, devuelvo el error y no creo nada.
    partida = new Partida(validacion.palabra, "duelo");
  }
  partidas.set(partida.id, partida); // Guardo la partida en el Map por su id.
  return partida.ver(); // Devuelvo la vista segura (sin palabra).
}

// Busco una partida que todavía se pueda jugar.
function partidaJugable(id) {
  const partida = partidas.get(id); // Busco por id en el Map.
  if (!partida) return { error: "No existe esa partida. Empezá un juego nuevo." }; // Id inexistente o vencido.
  if (partida.estado !== "jugando") return { error: "La partida ya terminó." }; // No se puede seguir jugando una partida cerrada.
  return { partida }; // Todo bien: la devuelvo.
}

// Registro una letra y actualizo el resultado de la partida.
export function jugarLetra(id, valor) {
  const { partida, error } = partidaJugable(id); // Desestructuro: o viene la partida o viene un error.
  if (error) return { error };
  const validacion = validarLetra(valor); // Valido que sea una sola letra.
  if (validacion.error) return { error: validacion.error };
  const { letra } = validacion; // Letra ya normalizada (mayúscula y sin tilde).
  if (partida.letras.has(letra)) return { error: `Ya probaste la ${letra}.` }; // No cuenta dos veces la misma letra.
  partida.letras.add(letra); // La registro como probada.
  if (!partida.contiene(letra)) partida.errores += 1; // Si no está en la palabra, sumo un error.
  partida.actualizarEstado(); // Compruebo si ganó o perdió.
  return partida.ver(); // Devuelvo el estado nuevo.
}

// Revelo una letra al azar a cambio de un intento. No se permite si deja al jugador sin vidas.
export function pedirPista(id) {
  const { partida, error } = partidaJugable(id);
  if (error) return { error };
  if (MAX_INTENTOS - partida.errores <= 1) return { error: "Te queda un solo intento: no hay pistas disponibles." }; // Así una pista nunca te hace perder.
  const ocultas = [...new Set([...partida.palabra].map(letraBase))].filter((letra) => !partida.letras.has(letra)); // Letras distintas (sin tilde) que todavía no se probaron.
  const letra = ocultas[Math.floor(Math.random() * ocultas.length)]; // Elijo una al azar.
  partida.letras.add(letra); // La revelo como si la hubiera probado el jugador.
  partida.errores += 1; // La pista cuesta una vida.
  partida.pistas += 1; // Llevo la cuenta de pistas.
  partida.actualizarEstado(); // Puede que la pista complete la palabra.
  return { ...partida.ver(), letraPista: letra }; // Copio la vista y agrego qué letra se reveló.
}

// El jugador abandona: la partida termina como perdida y se revela la palabra.
export function rendirse(id) {
  const { partida, error } = partidaJugable(id);
  if (error) return { error };
  partida.errores = MAX_INTENTOS; // Fuerzo el máximo de errores.
  partida.actualizarEstado(); // Esto la marca como "perdida".
  return partida.ver(); // Ahora ver() incluye la palabra.
}

// Devuelvo el estado final para guardar un puntaje ganado.
export function obtenerPartida(id) {
  const partida = partidas.get(id);
  return partida ? partida.ver() : null; // La vista, o null si no existe.
}

export function listarCategorias() {
  return Object.entries(NOMBRES_CATEGORIAS).map(([id, nombre]) => ({ id, nombre })); // De { animales: "Animales" } a [{ id: "animales", nombre: "Animales" }].
}
