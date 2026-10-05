// Quita el fondo de los fotogramas de la MacBook: el fondo y la sombra pasan a ser transparencia
// (la sombra queda como negro semitransparente), así los fotogramas sirven en modo claro y oscuro
// y la capa se puede girar en 3D sin que se vea un rectángulo.
//
// Uso (desde 3_React/R4/herramientas):
//   1. Copiar los fotogramas ORIGINALES (con fondo gris) a ./orig/frames-webp y ./orig/frames-webp-mobile
//   2. node quitar-fondo.mjs frames-webp 0 149   y   node quitar-fondo.mjs frames-webp-mobile 0 149
//   3. Copiar ./alfa/<carpeta>/*.webp a web/public/macbook/<carpeta>/
// Requiere: npm i playwright && npx playwright install chromium

import { chromium } from 'playwright'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
const [, , carpeta, desde, hasta] = process.argv
const b = await chromium.launch(); const pg = await b.newPage()
await pg.setContent('<!doctype html><title>quitar fondo</title>')
mkdirSync(`alfa/${carpeta}`, { recursive: true })
for (let f = +desde; f <= +hasta; f++) {
  const nombre = `frame_${String(f).padStart(3, '0')}.webp`
  const datos = await pg.evaluate(async (src) => {
    const im = new Image(); im.src = src; await im.decode()
    const W = im.naturalWidth, H = im.naturalHeight
    const c = document.createElement('canvas'); c.width = W; c.height = H
    const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(im, 0, 0)
    const img = ctx.getImageData(0, 0, W, H); const d = img.data
    const FONDO_LUM = (246 + 245 + 248) / 3
    // Fondo o sombra: gris neutro y no muy oscuro (la MacBook es azul marino o negra).
    const esFondo = (i) => {
      const r = d[i], g = d[i + 1], bl = d[i + 2]
      const max = Math.max(r, g, bl), min = Math.min(r, g, bl)
      return max - min <= 16 && bl - r <= 13 && (r + g + bl) / 3 >= 118
    }
    const fondo = new Uint8Array(W * H)
    const pila = []
    const sembrar = (x, y) => { const k = y * W + x; if (!fondo[k] && esFondo(k * 4)) { fondo[k] = 1; pila.push(k) } }
    for (let x = 0; x < W; x++) { sembrar(x, 0); sembrar(x, H - 1) }
    for (let y = 0; y < H; y++) { sembrar(0, y); sembrar(W - 1, y) }
    while (pila.length) {
      const k = pila.pop(); const x = k % W, y = (k / W) | 0
      if (x > 0) sembrar(x - 1, y); if (x < W - 1) sembrar(x + 1, y)
      if (y > 0) sembrar(x, y - 1); if (y < H - 1) sembrar(x, y + 1)
    }
    // Filtro de mayoría 5×5 sobre la máscara: el borde de la MacBook queda continuo en vez de
    // alternar píxeles de fondo y de aluminio (eso se veía dentado sobre negro).
    {
      const integral = new Int32Array((W + 1) * (H + 1))
      for (let y = 0; y < H; y++) {
        let fila = 0
        for (let x = 0; x < W; x++) {
          fila += fondo[y * W + x]
          integral[(y + 1) * (W + 1) + x + 1] = integral[y * (W + 1) + x + 1] + fila
        }
      }
      const suma = (x0, y0, x1, y1) =>
        integral[y1 * (W + 1) + x1] - integral[y0 * (W + 1) + x1] - integral[y1 * (W + 1) + x0] + integral[y0 * (W + 1) + x0]
      const R = Math.max(2, Math.round(W / 480)) // 4 px en 1920, 2 px en 960
      const suavizado = new Uint8Array(W * H)
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const x0 = Math.max(0, x - R), x1 = Math.min(W, x + R + 1), y0 = Math.max(0, y - R), y1 = Math.min(H, y + R + 1)
          suavizado[y * W + x] = suma(x0, y0, x1, y1) * 2 > (x1 - x0) * (y1 - y0) ? 1 : 0
        }
      }
      fondo.set(suavizado)
    }
    const orig = new Uint8ClampedArray(d)
    const sombraDe = (lum) => { const a = 1 - lum / FONDO_LUM; return a < 0.012 ? 0 : Math.min(1, Math.max(0, a)) }
    // Contorno = píxeles de la MacBook a 2 px o menos del fondo.
    const contorno = new Uint8Array(W * H)
    for (let k = 0; k < W * H; k++) {
      if (fondo[k]) continue
      const x = k % W, y = (k / W) | 0
      busca: for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const xx = x + dx, yy = y + dy
        if (xx >= 0 && yy >= 0 && xx < W && yy < H && fondo[yy * W + xx]) { contorno[k] = 1; break busca }
      }
    }
    for (let k = 0; k < W * H; k++) {
      const i = k * 4
      if (fondo[k]) {
        // Fondo/sombra: negro con transparencia según cuánto oscurece al fondo.
        const a = sombraDe((orig[i] + orig[i + 1] + orig[i + 2]) / 3)
        d[i] = 6; d[i + 1] = 8; d[i + 2] = 14; d[i + 3] = Math.round(a * 255)
        continue
      }
      if (!contorno[k]) continue
      // Contorno: la transparencia sale de cuánto se diferencia de la sombra vecina, y el color
      // se toma del aluminio de al lado (no se "despega" dividiendo: eso amplificaba el ruido).
      const x = k % W, y = (k / W) | 0
      let ns = 0, sr = 0, sg = 0, sb = 0, ni = 0, ir = 0, ig = 0, ib = 0
      for (let dy = -3; dy <= 3; dy++) {
        const yy = y + dy; if (yy < 0 || yy >= H) continue
        for (let dx = -3; dx <= 3; dx++) {
          const xx = x + dx; if (xx < 0 || xx >= W) continue
          const kk = yy * W + xx, ii = kk * 4
          if (fondo[kk]) { sr += orig[ii]; sg += orig[ii + 1]; sb += orig[ii + 2]; ns++ }
          else if (!contorno[kk]) { ir += orig[ii]; ig += orig[ii + 1]; ib += orig[ii + 2]; ni++ }
        }
      }
      // Sin aluminio "interior" cerca es una astilla suelta del borde: se trata como sombra.
      if (!ni) {
        const a = sombraDe((orig[i] + orig[i + 1] + orig[i + 2]) / 3)
        d[i] = 6; d[i + 1] = 8; d[i + 2] = 14; d[i + 3] = Math.round(a * 255)
        continue
      }
      const ref = ns ? [sr / ns, sg / ns, sb / ns] : [246, 245, 248]
      const dentro = ni ? [ir / ni, ig / ni, ib / ni] : [orig[i], orig[i + 1], orig[i + 2]]
      // Qué fracción del camino entre la sombra y el aluminio interior recorre este píxel.
      let num = 0, den = 0
      for (let c = 0; c < 3; c++) { num += (orig[i + c] - ref[c]) * (dentro[c] - ref[c]); den += (dentro[c] - ref[c]) ** 2 }
      const a = den > 1 ? Math.min(1, Math.max(0, num / den)) : 1
      const s = sombraDe((ref[0] + ref[1] + ref[2]) / 3)
      const total = a + (1 - a) * s
      if (total < 0.01) { d[i + 3] = 0; continue }
      const sombra = [6, 8, 14]
      for (let c = 0; c < 3; c++) d[i + c] = (a * dentro[c] + (1 - a) * s * sombra[c]) / total
      d[i + 3] = Math.round(total * 255)
    }
    ctx.putImageData(img, 0, 0)
    const blob = await new Promise((r) => c.toBlob(r, 'image/webp', 0.86))
    const buf = new Uint8Array(await blob.arrayBuffer())
    let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000))
    return btoa(s)
  }, 'data:image/webp;base64,' + readFileSync(`orig/${carpeta}/${nombre}`).toString('base64'))
  writeFileSync(`alfa/${carpeta}/${nombre}`, Buffer.from(datos, 'base64'))
}
await b.close()
