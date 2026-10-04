// ARCHIVO: server.js
// QUÉ HACE: es el punto de entrada del backend. Crea el servidor Express, entrega los archivos
// del frontend (HTML, CSS, JS), conecta la API (/api) y arranca a escuchar peticiones.

import "dotenv/config"; // Lee el archivo .env y carga sus valores en process.env (puerto, datos de MySQL).
import express from "express"; // Framework web: maneja rutas, JSON y archivos estáticos.
import path from "node:path"; // Utilidades nativas para armar rutas de archivos de forma segura.
import { fileURLToPath } from "node:url"; // Convierte la URL del módulo ES en una ruta de disco.
import { crearAlmacen } from "./modules/database.js"; // Prepara dónde se guardan los puntajes (MySQL o archivo).
import { crearRouter } from "./modules/routes.js"; // Fábrica que arma todas las rutas de la API.

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // En módulos ES no existe __dirname: lo reconstruyo desde import.meta.url.
const app = express(); // Creo la aplicación Express.
const puerto = Number(process.env.PORT || 3606); // Puerto del .env; si no está definido uso 3606.

app.use(express.json({ limit: "10kb" })); // Middleware que convierte el cuerpo JSON en req.body; limito a 10 KB para evitar abusos.
app.use(express.static(path.join(__dirname, "public"))); // Sirve la carpeta public (hoy no existe: Express simplemente la ignora).
app.use("/styles", express.static(path.join(__dirname, "styles"))); // Publica los CSS en la URL /styles.
app.use("/scripts", express.static(path.join(__dirname, "scripts"))); // Publica los módulos JS del navegador en /scripts.
app.use("/pages", express.static(path.join(__dirname, "pages"))); // Publica el HTML en /pages.
app.use("/Context", express.static(path.join(__dirname, "Context"))); // Publica el módulo del tema claro/oscuro en /Context.
const almacen = await crearAlmacen(); // Intenta conectar MySQL; si falla, devuelve un almacén en archivo (await de nivel superior, válido en módulos ES).
app.use("/api", crearRouter(almacen)); // Monta todas las rutas de la API bajo el prefijo /api.
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "pages", "index.html"))); // La raíz del sitio entrega la página del juego.
app.use((error, _req, res, _next) => { // Middleware de errores (4 parámetros): atrapa lo que las rutas pasen con next(error).
  console.error("Error del servidor:", error.message); // El detalle técnico queda solo en la consola del servidor.
  res.status(500).json({ ok: false, mensaje: "No se pudo completar la operación." }); // Al navegador le doy un mensaje genérico, sin filtrar datos internos.
});

app.listen(puerto, () => { // Empieza a escuchar conexiones en el puerto elegido.
  console.log(`JS6 El Ahorcado disponible en http://localhost:${puerto} (puntajes: ${almacen.tipo})`); // Aviso en consola y qué almacén quedó activo.
});
