const express = require("express");
const path = require("path");

const app = express();
// Puerto del proyecto 3.
const PORT = Number(process.env.PORT) || 3003;

// Publica la carpeta public con los recursos del frontend.
app.use(express.static(path.join(__dirname, "public")));

// Devuelve la pagina principal.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Inicia el servidor del proyecto.
app.listen(PORT, () => {
  console.log(`Proyecto 3 disponible en http://localhost:${PORT}`);
});

