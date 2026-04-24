const express = require("express");
const path = require("path");

const app = express();
// Puerto base del proyecto 2.
const preferredPort = Number(process.env.PORT) || 3002;

// Expone HTML, CSS y JS de la carpeta public.
app.use(express.static(path.join(__dirname, "public")));

// Carga la pagina principal del proyecto.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Intenta iniciar el servidor y, si el puerto esta ocupado, prueba con el siguiente.
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Proyecto 2 disponible en http://localhost:${port}`);
  });

  server.on("error", (error) => {
    // Si no se definio PORT manualmente, busca un puerto libre.
    if (error.code === "EADDRINUSE" && !process.env.PORT) {
      const nextPort = port + 1;
      console.warn(`El puerto ${port} ya esta en uso. Intentando con el puerto ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    // Si PORT fue fijado y esta ocupado, corta la ejecucion.
    if (error.code === "EADDRINUSE") {
      console.error(`El puerto ${port} ya esta en uso. Cambia la variable PORT o libera ese puerto.`);
      process.exit(1);
    }

    throw error;
  });
}

startServer(preferredPort);
