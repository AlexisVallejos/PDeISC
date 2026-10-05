import { ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useProgresoScroll } from '../hooks/useProgresoScroll'
import { useReducirMovimiento } from '../hooks/useReducirMovimiento'

// 150 fotogramas de la MacBook abriéndose (public/macbook). En celular se usan los de 960×540.
const TOTAL = 150
const ruta = (carpeta, i) => `/macbook/${carpeta}/frame_${String(i).padStart(3, '0')}.webp`

// En el último fotograma la MacBook ocupa ~48 % del ancho de la imagen. En pantallas verticales
// la imagen completa quedaría diminuta, así que la agrando hasta que la MacBook llene el ancho;
// los bordes que se recortan son solo fondo #f5f5f7, igual que la página.
const ANCHO_MAC = 0.48
const RELLENO_MAC = 0.94

function tramo(p, desde, hasta) {
  return Math.min(1, Math.max(0, (p - desde) / (hasta - desde)))
}

// El scroll mueve un objetivo; el fotograma lo sigue con un resorte sin rebote,
// así la apertura se ve continua aunque la rueda del mouse avance a saltos.
const RESPUESTA = 0.1 // segundos

export default function HeroMacbook({ perfil }) {
  const pistaRef = useRef(null)
  const canvasRef = useRef(null)
  const introRef = useRef(null)
  const reducir = useReducirMovimiento()
  const [carpeta] = useState(() =>
    window.matchMedia('(max-width: 768px)').matches ? 'frames-webp-mobile' : 'frames-webp',
  )

  const imagenes = useRef([])
  const fisica = useRef({ objetivo: 0, actual: 0, frame: 0, ultimo: 0, dibujado: -1 })

  // Dibuja el fotograma i, o el cargado más cercano si ese todavía no llegó.
  const dibujar = useCallback((i, forzar = false) => {
    const canvas = canvasRef.current
    const lista = imagenes.current
    if (!canvas || !lista.length) return

    let imagen = null
    for (let d = 0; d < TOTAL && !imagen; d++) {
      for (const j of [i - d, i + d]) {
        const candidata = lista[j]
        if (candidata?.complete && candidata.naturalWidth) {
          imagen = candidata
          break
        }
      }
    }
    if (!imagen || (!forzar && fisica.current.dibujado === imagen)) return
    fisica.current.dibujado = imagen

    const { width: cw, height: ch } = canvas
    const { naturalWidth: iw, naturalHeight: ih } = imagen
    const contener = Math.min(cw / iw, ch / ih)
    const cubrir = Math.max(cw / iw, ch / ih)
    const llenarMac = (RELLENO_MAC * cw) / (ANCHO_MAC * iw)
    const escala = Math.min(cubrir, Math.max(contener, llenarMac))
    const w = iw * escala
    const h = ih * escala

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, cw, ch)
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(imagen, (cw - w) / 2, (ch - h) / 2, w, h)
  }, [])

  const fotogramaActual = () => Math.round(fisica.current.actual * (TOTAL - 1))

  const pintar = useCallback(
    (p) => {
      dibujar(Math.round(p * (TOTAL - 1)))
      const salida = tramo(p, 0, 0.14)
      introRef.current.style.opacity = 1 - salida
      introRef.current.style.transform = `translate3d(0, ${-28 * salida}px, 0)`
    },
    [dibujar],
  )

  const paso = useCallback(
    (ahora) => {
      const f = fisica.current
      const dt = Math.min(0.05, (ahora - (f.ultimo || ahora)) / 1000)
      f.ultimo = ahora
      f.actual += (f.objetivo - f.actual) * (1 - Math.exp(-dt / RESPUESTA))

      if (Math.abs(f.objetivo - f.actual) < 0.0005) {
        f.actual = f.objetivo
        f.frame = 0
        f.ultimo = 0
      } else {
        f.frame = requestAnimationFrame(paso)
      }
      pintar(f.actual)
    },
    [pintar],
  )

  useProgresoScroll(pistaRef, (p) => {
    if (reducir) return
    const f = fisica.current
    f.objetivo = p
    if (!f.frame) f.frame = requestAnimationFrame(paso)
  })

  // Precarga: el primer fotograma (o el último, con "reducir movimiento") va primero;
  // el resto se pide en orden. Cuando llega el que se está esperando, se dibuja.
  useEffect(() => {
    const inicial = reducir ? TOTAL - 1 : 0
    const orden = [inicial, ...Array.from({ length: TOTAL }, (_, i) => i).filter((i) => i !== inicial)]
    const lista = new Array(TOTAL)
    imagenes.current = lista

    for (const i of orden) {
      const imagen = new Image()
      imagen.decoding = 'async'
      if (i === inicial) imagen.fetchPriority = 'high'
      imagen.onload = () => {
        if (imagenes.current === lista && Math.abs(i - fotogramaActual()) <= 1) dibujar(fotogramaActual(), true)
      }
      imagen.src = ruta(carpeta, i)
      lista[i] = imagen
    }

    return () => {
      for (const imagen of lista) imagen.onload = null
    }
  }, [carpeta, reducir, dibujar])

  // El canvas mide lo mismo que su caja en píxeles reales de la pantalla (nítido en retina).
  useEffect(() => {
    const canvas = canvasRef.current
    function ajustar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      dibujar(fotogramaActual(), true)
    }
    ajustar()
    const observador = new ResizeObserver(ajustar)
    observador.observe(canvas)
    return () => observador.disconnect()
  }, [dibujar])

  // Con "reducir movimiento" la MacBook queda abierta (último fotograma) y no se anima.
  useEffect(() => {
    const f = fisica.current
    cancelAnimationFrame(f.frame)
    f.frame = 0
    if (reducir) {
      f.actual = f.objetivo = 1
      dibujar(TOTAL - 1, true)
      introRef.current.style.opacity = 1
      introRef.current.style.transform = 'none'
    } else {
      f.actual = f.objetivo
      pintar(f.actual)
    }
    return () => cancelAnimationFrame(f.frame)
  }, [reducir, dibujar, pintar])

  return (
    <section id="inicio" className={reducir ? 'hero hero--quieto' : 'hero'} ref={pistaRef} aria-label="Presentación">
      <div className="hero-escenario">
        <canvas ref={canvasRef} className="hero-canvas" role="img" aria-label="Una MacBook que se abre" />
        <div className="hero-intro" ref={introRef}>
          <p className="sobretitulo">{perfil.rol}</p>
          <h1 className="titulo-gigante">{perfil.nombre}</h1>
          <p className="hero-pista">
            Deslizá para abrir
            <ChevronDown size={18} aria-hidden="true" />
          </p>
        </div>
      </div>
    </section>
  )
}
