// ARCHIVO: Context/tema.js
// QUÉ HACE: maneja el tema claro/oscuro. Recuerda la elección del usuario en localStorage, si nunca
// eligió usa la preferencia del sistema operativo, cambia la hoja de estilos y avisa al resto de la
// app con un evento propio ("tema-cambiado") para que la escena 3D también cambie de colores.

// Aplico el tema guardado (o el del sistema) y lo mantengo entre visitas.
function leerTema() {
  try { // localStorage puede fallar (modo privado, cookies bloqueadas), por eso va en try/catch.
    const guardado = localStorage.getItem("js6-tema"); // Busco la elección previa: "claro" u "oscuro".
    if (guardado) return guardado; // Si existe, la respeto.
  } catch {
    // Sin acceso a localStorage uso la preferencia del sistema.
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "oscuro"; // Consulto si el sistema operativo está en modo claro.
}

// Cambio la hoja de colores y aviso al resto de la app (la escena 3D también cambia).
function aplicar(tema) {
  const oscuro = tema === "oscuro"; // true si el tema pedido es el oscuro.
  document.querySelector("#tema-css").href = oscuro ? "/styles/dark.css" : "/styles/light.css"; // Cambio el <link> de colores: el navegador recarga solo esa hoja.
  document.documentElement.dataset.tema = tema; // Escribo data-tema="..." en <html>; el CSS y el JS lo usan para saber el tema actual.
  document.querySelector("#tema").setAttribute("aria-label", oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"); // El botón explica a lectores de pantalla qué hará al apretarlo.
  document.dispatchEvent(new CustomEvent("tema-cambiado", { detail: { oscuro } })); // Disparo un evento propio con el dato "oscuro"; main.js lo escucha para recolorear la escena 3D.
}

export function iniciarTema() { // Se llama una vez al cargar la página.
  aplicar(leerTema()); // Aplico el tema inicial.
  document.querySelector("#tema").addEventListener("click", () => { // Al hacer click en el botón del sol/luna...
    const nuevo = document.documentElement.dataset.tema === "oscuro" ? "claro" : "oscuro"; // ...alterno al tema contrario.
    aplicar(nuevo);
    try {
      localStorage.setItem("js6-tema", nuevo); // Guardo la elección para la próxima visita.
    } catch {
      // Si no se puede guardar, el tema dura solo esta visita.
    }
  });
}

export function temaOscuro() { // Utilidad: main.js la usa para saber con qué colores arrancar la escena 3D.
  return document.documentElement.dataset.tema === "oscuro";
}
