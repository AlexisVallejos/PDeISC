const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3003;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Proyecto 3 disponible en http://localhost:${PORT}`);
});

