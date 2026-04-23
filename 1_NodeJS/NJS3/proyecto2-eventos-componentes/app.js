const express = require("express");
const path = require("path");

const app = express();
const preferredPort = Number(process.env.PORT) || 3002;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Proyecto 2 disponible en http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && !process.env.PORT) {
      const nextPort = port + 1;
      console.warn(`El puerto ${port} ya esta en uso. Intentando con el puerto ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    if (error.code === "EADDRINUSE") {
      console.error(`El puerto ${port} ya esta en uso. Cambia la variable PORT o libera ese puerto.`);
      process.exit(1);
    }

    throw error;
  });
}

startServer(preferredPort);
