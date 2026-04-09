import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = createServer((req, res) => {

const filePath = path.join(__dirname, "..", "web", "index.html"); //llama a el archivo

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err); // 👈 importante para ver el error real

      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error al cargar el archivo");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });

});

server.listen(3000, "127.0.0.1", () => {
  console.log("Servidor en http://127.0.0.1:3000 🚀");
});