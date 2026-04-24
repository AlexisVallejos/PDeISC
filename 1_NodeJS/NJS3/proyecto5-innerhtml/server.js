const express = require("express");
const path = require("path");

const app = express();
// Puerto del proyecto 5.
const PORT = Number(process.env.PORT) || 3005;

// Sirve todos los archivos del frontend desde public.
app.use(express.static(path.join(__dirname, "public")));

// Entrega el index principal del proyecto.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Inicia el servidor.
app.listen(PORT, () => {
  console.log(`Proyecto 5 disponible en http://localhost:${PORT}`);
});

