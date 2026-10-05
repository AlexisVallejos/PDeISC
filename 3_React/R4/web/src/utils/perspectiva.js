// Transformación proyectiva que lleva un rectángulo de w×h (con origen arriba a la izquierda)
// a un cuadrilátero cualquiera [x0,y0, x1,y1, x2,y2, x3,y3] = arriba-izq, arriba-der, abajo-der, abajo-izq.
// Es la homografía de Heckbert ("Fundamentals of Texture Mapping"), escrita como matrix3d de CSS.
export function matrizHacia(w, h, [x0, y0, x1, y1, x2, y2, x3, y3]) {
  const dx1 = x1 - x2
  const dx2 = x3 - x2
  const dx3 = x0 - x1 + x2 - x3
  const dy1 = y1 - y2
  const dy2 = y3 - y2
  const dy3 = y0 - y1 + y2 - y3

  let g = 0
  let k = 0
  if (dx3 !== 0 || dy3 !== 0) {
    const det = dx1 * dy2 - dx2 * dy1
    g = (dx3 * dy2 - dx2 * dy3) / det
    k = (dx1 * dy3 - dx3 * dy1) / det
  }
  const a = x1 - x0 + g * x1
  const b = x3 - x0 + k * x3
  const d = y1 - y0 + g * y1
  const e = y3 - y0 + k * y3

  // Columnas de matrix3d: (u = x/w, v = y/h) → ((a·u + b·v + x0) / (g·u + k·v + 1), …)
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${e / h},0,${k / h},0,0,1,0,${x0},${y0},0,1)`
}
