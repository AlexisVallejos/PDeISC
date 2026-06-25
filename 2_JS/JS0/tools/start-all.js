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

function shutdown() {
  for (const p of procs) {
    if (!p.killed) p.kill();
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
