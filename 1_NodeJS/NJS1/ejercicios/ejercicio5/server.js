import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3005;
const BASE_DIR = fileURLToPath(new URL(".", import.meta.url));

const rutas = new Map([
  ["/", "pages/index.html"],
  ["/index.html", "pages/index.html"],
  ["/styles/style.css", "styles/style.css"],
  ["/scripts/main.js", "scripts/main.js"]
]);

const tipos = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"]
]);

const server = createServer(async (req, res) => {
  const ruta = rutas.get(req.url ?? "");

  if (!ruta) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Ruta no encontrada");
    return;
  }

  try {
    const archivo = await readFile(join(BASE_DIR, ruta));
    res.writeHead(200, {
      "Content-Type": tipos.get(extname(ruta)) ?? "text/plain; charset=utf-8"
    });
    res.end(archivo);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("No se pudo cargar el archivo solicitado");
  }
});

server.listen(PORT, () => {
  console.log(`Ejercicio 5 disponible en http://127.0.0.1:${PORT}`);
  console.log("Servidor independiente del ejercicio 5.");
});
