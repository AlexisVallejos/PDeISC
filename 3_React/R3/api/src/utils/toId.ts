// convierte el id recibido en número entero positivo, o null si no sirve
export function toId(value: unknown): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
