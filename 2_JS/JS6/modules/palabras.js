// ARCHIVO: modules/palabras.js
// QUÉ HACE: banco de palabras del modo "Al azar", agrupado por categoría, y la función que elige una.
// Las palabras se guardan en mayúsculas (con tildes) para que coincidan con lo que valida el juego.

// Cada clave es el id de una categoría y su valor es un array (lista) de palabras.
export const CATEGORIAS = {
  animales: ["ELEFANTE", "JIRAFA", "PINGÜINO", "COCODRILO", "MURCIÉLAGO", "TORTUGA", "CANGURO", "DELFÍN", "ARDILLA", "RINOCERONTE", "CAMALEÓN", "LECHUZA", "HORMIGA", "CARPINCHO", "YAGUARETÉ"],
  frutas: ["MANZANA", "FRUTILLA", "SANDÍA", "ANANÁ", "DURAZNO", "MANDARINA", "CEREZA", "KIWI", "POMELO", "ARÁNDANO", "FRAMBUESA", "MARACUYÁ", "CIRUELA", "BANANA", "MEMBRILLO"],
  paises: ["ARGENTINA", "URUGUAY", "JAPÓN", "MARRUECOS", "CANADÁ", "PORTUGAL", "AUSTRALIA", "NORUEGA", "COLOMBIA", "TAILANDIA", "EGIPTO", "ISLANDIA", "MÉXICO", "PERÚ", "FINLANDIA"],
  objetos: ["PARAGUAS", "LINTERNA", "TIJERA", "CUADERNO", "ESCALERA", "MOCHILA", "TELESCOPIO", "BRÚJULA", "AURICULARES", "CANDADO", "LÁMPARA", "TECLADO", "RELOJ", "ALMOHADA", "TERMO"],
  deportes: ["FÚTBOL", "BÁSQUET", "NATACIÓN", "AJEDREZ", "HANDBALL", "ESGRIMA", "CICLISMO", "RUGBY", "VÓLEY", "ATLETISMO", "HOCKEY", "PATINAJE", "ESCALADA", "BOXEO", "SURF"],
  profesiones: ["ASTRONAUTA", "BOMBERO", "CARPINTERO", "PROGRAMADOR", "VETERINARIA", "ARQUITECTA", "PANADERO", "ENFERMERA", "ELECTRICISTA", "PERIODISTA", "MÚSICO", "JARDINERO", "PILOTO", "CIENTÍFICA", "ABOGADO"]
};

// Nombre "lindo" de cada categoría para mostrar en pantalla (el id no lleva tildes ni mayúsculas).
export const NOMBRES_CATEGORIAS = {
  animales: "Animales",
  frutas: "Frutas",
  paises: "Países",
  objetos: "Objetos",
  deportes: "Deportes",
  profesiones: "Profesiones"
};

// Elijo una palabra al azar; sin categoría válida mezclo todas.
export function palabraAlAzar(categoria) {
  const claves = Object.keys(CATEGORIAS); // Lista de ids: ["animales", "frutas", ...].
  // Object.hasOwn comprueba que la categoría exista de verdad (evita ids como "__proto__"); si no existe, sorteo una.
  const clave = Object.hasOwn(CATEGORIAS, String(categoria)) ? categoria : claves[Math.floor(Math.random() * claves.length)];
  const lista = CATEGORIAS[clave]; // Array de palabras de la categoría elegida.
  // Math.random() da un decimal en [0,1): multiplicado por el largo y redondeado hacia abajo da un índice válido.
  return { palabra: lista[Math.floor(Math.random() * lista.length)], categoria: clave };
}
