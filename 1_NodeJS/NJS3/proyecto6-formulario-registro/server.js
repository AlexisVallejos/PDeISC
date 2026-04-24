const express = require("express");
const path = require("path");

const app = express();
// Puerto del proyecto 6.
const PORT = Number(process.env.PORT) || 3006;

// Publica todos los archivos estaticos del formulario.
app.use(express.static(path.join(__dirname, "public")));

// Devuelve el index principal del proyecto.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Inicia el servidor Express.
app.listen(PORT, () => {
  console.log(`Proyecto 6 disponible en http://localhost:${PORT}`);
});
