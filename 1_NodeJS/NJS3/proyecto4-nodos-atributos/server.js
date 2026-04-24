const express = require("express");
const path = require("path");

const app = express();
// Puerto del proyecto 4.
const PORT = Number(process.env.PORT) || 3004;

// Expone todos los archivos estaticos del proyecto.
app.use(express.static(path.join(__dirname, "public")));

// Devuelve la pagina principal.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Inicia el servidor Express.
app.listen(PORT, () => {
  console.log(`Proyecto 4 disponible en http://localhost:${PORT}`);
});

