import { spawn } from "node:child_process";

const servers = [
  { label: "launcher", file: "server.js" },
  { label: "punto-1", file: "modules/ejercicio01_fetch/server.js" },
  { label: "punto-2", file: "modules/ejercicio02_formulario/server.js" },
  { label: "punto-3", file: "modules/ejercicio03_busqueda/server.js" },
  { label: "punto-4", file: "modules/ejercicio04_alumnos/server.js" }
];

for (const server of servers) {
  const child = spawn(process.execPath, [server.file], {
    stdio: "inherit"
  });

  child.on("error", (error) => {
    console.error(`No se pudo iniciar ${server.label}:`, error);
  });
}
