/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: tools/fix-mojibake.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const TEXT_EXTENSIONS = new Set([".js", ".html", ".json", ".md", ".css"]);
const MARKERS = ["\u00C3", "\u00C2", "\uFFFD", "\u0192", "\u00A2", "\u20AC", "\u2122"];

// mojibakeScore: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
function mojibakeScore(text) {
  return MARKERS.reduce((total, marker) => total + (text.split(marker).length - 1), 0);
}

// recodeOnce: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
function recodeOnce(text) {
  return Buffer.from(text, "latin1").toString("utf8");
}

// normalizeText: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
function normalizeText(text) {
  let current = text;
  let currentScore = mojibakeScore(current);

  for (let index = 0; index < 3; index += 1) {
    const candidate = recodeOnce(current);
    const candidateScore = mojibakeScore(candidate);
    if (candidateScore >= currentScore) break;
    current = candidate;
    currentScore = candidateScore;
  }

  return current
    .replaceAll("", "")
    .replaceAll('', "")
    .replaceAll("ejecutarM\uFFFDtodo", "ejecutarM\u00E9todo")
    .replaceAll("resultadoOperaci\uFFFDn", "resultadoOperaci\u00F3n")
    .replaceAll("informaci\uFFFDn", "informaci\u00F3n")
    .replaceAll("operaci\uFFFDn", "operaci\u00F3n")
    .replaceAll("Operaci\uFFFDn", "Operaci\u00F3n")
    .replaceAll("M\uFFFDtodo", "M\u00E9todo")
    .replaceAll("m\uFFFDtodo", "m\u00E9todo");
}

// walk: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) files.push(fullPath);
  }
  return files;
}

let changed = 0;

for (const filePath of walk(ROOT)) {
  const original = fs.readFileSync(filePath, "utf8");
  const normalized = normalizeText(original);

  if (normalized !== original) {
    fs.writeFileSync(filePath, normalized, "utf8");
    changed += 1;
    console.log(`fixed: ${path.relative(ROOT, filePath)}`);
  }
}

console.log(`done: ${changed} file(s)`);
