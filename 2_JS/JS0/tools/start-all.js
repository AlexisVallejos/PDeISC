/**
 * DOCUMENTACION PARA DEFENDER
 * Archivo: tools/start-all.js
 * Rol: forma parte del proyecto y separa responsabilidades para que el codigo sea mas facil de explicar y mantener.
 * Idea clave: mantener este codigo separado ayuda a explicar que hace cada parte sin mezclar responsabilidades.
 * Como defenderlo: explicar primero que datos entran, que proceso se aplica y que salida produce.
 * Validacion: remarcar donde se controlan errores para que la app no falle con datos incorrectos.
 */
import { spawn } from "node:child_process";

const commands = [
  ["npm", ["run", "start"]],
  ["npm", ["run", "start:push"]],
  ["npm", ["run", "start:pop"]],
  ["npm", ["run", "start:unshift"]],
  ["npm", ["run", "start:shift"]],
  ["npm", ["run", "start:splice"]],
  ["npm", ["run", "start:slice"]],
  ["npm", ["run", "start:indexOf"]],
  ["npm", ["run", "start:includes"]],
  ["npm", ["run", "start:forEach"]],
  ["npm", ["run", "start:map"]],
  ["npm", ["run", "start:filter"]],
  ["npm", ["run", "start:reduce"]],
  ["npm", ["run", "start:sort"]],
  ["npm", ["run", "start:reverse"]],
  ["npm", ["run", "start:secreto"]]
];

const procs = [];

for (const [cmd, args] of commands) {
  const child = spawn(cmd, args, {
    stdio: "inherit",
    shell: true
  });
  procs.push(child);
}

// shutdown: Agrupa una parte de la logica para que el archivo sea mas facil de leer y defender.
function shutdown() {
  for (const p of procs) {
    if (!p.killed) p.kill();
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
