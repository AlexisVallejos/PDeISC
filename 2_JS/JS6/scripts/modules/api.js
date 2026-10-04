// ARCHIVO: scripts/modules/api.js
// QUÉ HACE: es el único lugar del navegador que habla con el servidor. Cada función usa la Fetch API
// para llamar a un endpoint de /api y devuelve el JSON. Si el servidor responde con error, lanza una
// excepción con el mensaje, que main.js atrapa y muestra al usuario.

// Envío una solicitud JSON y convierto los errores del servidor en mensajes claros.
async function pedir(url, opciones = {}) {
  const respuesta = await fetch(url, { // fetch hace la petición HTTP y devuelve una promesa.
    ...opciones, // Copio método y cuerpo que mandó quien me llamó.
    headers: { "Content-Type": "application/json", ...opciones.headers } // Aviso al servidor que envío JSON.
  });
  const datos = await respuesta.json().catch(() => ({})); // Leo el JSON; si la respuesta no es JSON válido uso un objeto vacío.
  if (!respuesta.ok) throw new Error(datos.mensaje || "No se pudo completar la solicitud."); // "ok" es false con códigos 4xx/5xx: lanzo error con el mensaje del servidor.
  return datos; // Respuesta exitosa.
}

// Solicito una partida: con palabra propia (duelo) o elegida por el servidor (azar).
export function iniciarPartida(datos) {
  return pedir("/api/partidas", { method: "POST", body: JSON.stringify(datos) }); // JSON.stringify convierte el objeto en texto JSON para el cuerpo.
}

// Pido una pista: el servidor revela una letra y descuenta un intento.
export function pedirPista(id) {
  return pedir(`/api/partidas/${encodeURIComponent(id)}/pista`, { method: "POST" }); // encodeURIComponent protege la URL de caracteres especiales en el id.
}

// Abandono la partida actual para ver la palabra.
export function rendirse(id) {
  return pedir(`/api/partidas/${encodeURIComponent(id)}/rendirse`, { method: "POST" });
}

// Traigo las categorías del modo al azar.
export function cargarCategorias() {
  return pedir("/api/categorias"); // Sin método: fetch usa GET por defecto.
}

// Envío una letra al servidor y recibo el estado actualizado.
export function enviarLetra(id, letra) {
  return pedir(`/api/partidas/${encodeURIComponent(id)}/letras`, {
    method: "POST", body: JSON.stringify({ letra }) // Cuerpo: { "letra": "A" }.
  });
}

// Consulto los puntajes guardados en MySQL.
export function cargarPuntajes() {
  return pedir("/api/puntajes");
}

// Guardo el puntaje de la partida ganada.
export function guardarPuntaje(nombre, partidaId) {
  return pedir("/api/puntajes", {
    method: "POST", body: JSON.stringify({ nombre, partidaId }) // Mando solo nombre e id: los puntos los calcula el servidor.
  });
}
