// ARCHIVO: modules/validaciones.js
// QUÉ HACE: validaciones del servidor. Nunca confío en lo que manda el navegador: aunque el
// frontend ya valide, el backend repite todo porque alguien podría llamar a la API directamente.
// Cada función devuelve { error } si algo está mal o el dato limpio si está bien.

// Paso una letra a su forma base: "Á" → "A", "Ü" → "U". La Ñ se conserva.
export function letraBase(letra) {
  if (letra === "Ñ") return "Ñ"; // La Ñ es una letra distinta en español: no se la convierte en N.
  return letra.normalize("NFD").replace(/[̀-ͯ]/g, ""); // NFD separa la letra de su tilde; la regex borra las marcas de acento (rango Unicode U+0300–U+036F).
}

// Valido que la palabra secreta tenga solo letras y una longitud jugable.
export function validarPalabra(valor) {
  const palabra = String(valor ?? "").trim().normalize("NFC"); // Convierto a texto (null/undefined → ""), quito espacios y unifico la forma Unicode.
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{3,20}$/.test(palabra)) { // Solo letras (con tildes y ñ), entre 3 y 20 caracteres, sin espacios ni símbolos.
    return { error: "Ingresá una palabra de 3 a 20 letras, sin espacios ni símbolos." }; // Mensaje que verá el usuario.
  }
  return { palabra: palabra.toLocaleUpperCase("es-AR") }; // Guardo la palabra en mayúsculas para comparar siempre igual.
}

// Valido el nombre antes de registrar el resultado.
export function validarNombre(valor) {
  const nombre = String(valor ?? "").trim().replace(/\s+/g, " "); // Texto sin espacios en los bordes y con espacios repetidos reducidos a uno.
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,40}$/.test(nombre)) { // Letras y espacios, entre 2 y 40 caracteres: así no entra HTML ni símbolos raros.
    return { error: "El nombre debe tener entre 2 y 40 letras." }; // Mensaje de error.
  }
  return { nombre }; // Nombre limpio, listo para guardar.
}

// Valido la letra que intenta el jugador y la guardo sin tilde.
export function validarLetra(valor) {
  const letra = String(valor ?? "").trim().normalize("NFC").toLocaleUpperCase("es-AR"); // Limpio y paso a mayúscula.
  if (!/^[A-ZÁÉÍÓÚÜÑ]$/.test(letra)) return { error: "Ingresá una sola letra." }; // Debe ser exactamente un carácter alfabético.
  return { letra: letraBase(letra) }; // Devuelvo la letra sin tilde: así "Á" cuenta como "A".
}
