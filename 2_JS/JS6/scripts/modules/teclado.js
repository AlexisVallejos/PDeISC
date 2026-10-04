// ARCHIVO: scripts/modules/teclado.js
// QUÉ HACE: construye y actualiza el teclado en pantalla. Cada letra es un <button> real, así sirve
// con mouse, dedo, teclado físico (Tab/Enter) y lectores de pantalla.

const FILAS = ["QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM"]; // Distribución QWERTY en español (con Ñ), una cadena por fila.

// Armo el teclado en pantalla. Cada tecla es un botón real para que funcione con teclado y lector de pantalla.
export function crearTeclado(contenedor, alElegir) { // "alElegir" es la función que se llama con la letra elegida.
  contenedor.replaceChildren(...FILAS.map((fila) => { // Vacío el contenedor y pongo una <div> por fila.
    const div = document.createElement("div"); // Contenedor de la fila.
    div.className = "fila-teclas"; // Clase CSS para ubicarlas en línea.
    [...fila].forEach((letra) => { // [...cadena] separa en letras sueltas.
      const tecla = document.createElement("button"); // Botón de la letra.
      tecla.type = "button"; // "button" evita que dispare un envío de formulario.
      tecla.className = "tecla"; // Clase de estilo.
      tecla.textContent = letra; // Texto visible (textContent no interpreta HTML: es seguro).
      tecla.dataset.letra = letra; // Guardo la letra en data-letra para encontrarla después.
      tecla.setAttribute("aria-label", `Letra ${letra}`); // Texto para lectores de pantalla.
      tecla.addEventListener("click", () => alElegir(letra)); // Al hacer click aviso a main.js qué letra se eligió.
      div.append(tecla); // Meto el botón en su fila.
    });
    return div; // replaceChildren recibe todas las filas.
  }));
}

// Pinto aciertos y fallos, y bloqueo las letras ya usadas o todo el teclado si no hay partida.
export function actualizarTeclado(contenedor, partida) { // "partida" puede ser null cuando todavía no empezó nada.
  const jugando = partida?.estado === "jugando"; // "?." evita error si partida es null.
  contenedor.classList.toggle("inactivo", !jugando); // Clase que atenúa el teclado cuando no se puede jugar.
  contenedor.querySelectorAll(".tecla").forEach((tecla) => { // Recorro todos los botones.
    const letra = tecla.dataset.letra; // Letra del botón.
    const acierto = partida?.aciertos.includes(letra) ?? false; // ¿Está entre las letras acertadas? (?? false: si no hay partida, no).
    const fallo = partida?.fallos.includes(letra) ?? false; // ¿Está entre las falladas?
    tecla.classList.toggle("acierto", acierto); // Verde si acertó.
    tecla.classList.toggle("fallo", fallo); // Rojo si falló.
    tecla.disabled = !jugando || acierto || fallo; // Se bloquea si no se juega o si la letra ya se usó.
    tecla.setAttribute("aria-label", `Letra ${letra}${acierto ? ", acierto" : fallo ? ", no está" : ""}`); // El estado también se comunica sin depender del color.
  });
}

// Marco brevemente la tecla en pantalla cuando se usa el teclado físico.
export function marcarTecla(contenedor, letra) {
  const tecla = contenedor.querySelector(`[data-letra="${letra}"]`); // Busco el botón por su atributo data-letra.
  if (!tecla) return; // Si no existe (letra rara), no hago nada.
  tecla.classList.add("presionada"); // Clase que muestra la tecla hundida.
  setTimeout(() => tecla.classList.remove("presionada"), 140); // La quito a los 140 ms para que parezca un toque.
}
