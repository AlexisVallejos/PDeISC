import { ArrowUpRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import pantalla from '../data/pantalla.json'
import { useProgresoScroll } from '../hooks/useProgresoScroll'
import { useReducirMovimiento } from '../hooks/useReducirMovimiento'
import { matrizHacia } from '../utils/perspectiva'
import { conEnfasis, primerNombre } from '../utils/texto'
import Estadisticas from './Estadisticas'
import PantallaSitio, { ALTO_PANTALLA, ANCHO_PANTALLA } from './PantallaSitio'

// 150 fotogramas de la MacBook abriéndose (public/macbook). En celular, los de 960×540.
const TOTAL = 150
const fotogramaDe = (p) => Math.round(p * (TOTAL - 1))
const ruta = (carpeta, i) => `/macbook/${carpeta}/frame_${String(i).padStart(3, '0')}.webp`

// Medidas de la MacBook dentro del fotograma, como fracción de la imagen (último fotograma):
// ocupa el 47,4 % del ancho y su centro está en (0,5 ; 0,509). Cerrada (fotograma 0) es un 7 % más ancha.
const ANCHO_MAC = 0.474
const CENTRO_MAC = [0.5, 0.509]
const MARGEN_CERRADA = 1.07
const ALTO_SOBRE_ANCHO = 0.95

// La pantalla se "enciende" con el mini sitio entre estos fotogramas.
const ENCENDIDO = [96, 128]

// El fotograma sigue al scroll con un resorte sin rebote: la apertura es continua aunque
// la rueda del mouse avance a saltos, y se puede invertir en cualquier momento.
const RESPUESTA = 0.1 // segundos

const FONDO = '246, 245, 248' // #f6f5f8, el fondo medido en los fotogramas y el de la página
const tramo = (v, desde, hasta) => Math.min(1, Math.max(0, (v - desde) / (hasta - desde)))
const suave = (t) => t * t * (3 - 2 * t)

// Si el fotograma no llega a un borde del escenario, su sombra terminaría en un corte recto:
// un degradé hacia el color de la página en cada borde visible lo disimula.
function difuminarBordes(ctx, x, y, w, h) {
  const borde = h * 0.12
  const { width: cw, height: ch } = ctx.canvas
  const bordes = [
    y > 0 && [x, y, x, y + borde, x, y, w, borde],
    y + h < ch && [x, y + h, x, y + h - borde, x, y + h - borde, w, borde],
    x > 0 && [x, y, x + borde, y, x, y, borde, h],
    x + w < cw && [x + w, y, x + w - borde, y, x + w - borde, y, borde, h],
  ]
  for (const b of bordes) {
    if (!b) continue
    const [x0, y0, x1, y1, rx, ry, rw, rh] = b
    const degrade = ctx.createLinearGradient(x0, y0, x1, y1)
    degrade.addColorStop(0, `rgb(${FONDO})`)
    degrade.addColorStop(1, `rgba(${FONDO}, 0)`)
    ctx.fillStyle = degrade
    ctx.fillRect(rx, ry, rw, rh)
  }
}

export default function HeroMacbook({ perfil, estadisticas }) {
  const pistaRef = useRef(null)
  const escenarioRef = useRef(null)
  const zonaRef = useRef(null)
  const canvasRef = useRef(null)
  const pantallaRef = useRef(null)
  const indicadorRef = useRef(null)
  const reducir = useReducirMovimiento()
  const [carpeta] = useState(() =>
    window.matchMedia('(max-width: 768px)').matches ? 'frames-webp-mobile' : 'frames-webp',
  )

  const imagenes = useRef([])
  // geo: dónde va la imagen completa dentro del escenario, en px CSS.
  const geo = useRef({ x: 0, y: 0, w: 0, h: 0 })
  const fisica = useRef({ objetivo: 0, actual: 0, frame: 0, ultimo: 0, dibujado: null, pantalla: -1 })

  // Dibuja el fotograma i, o el cargado más cercano si ese todavía no llegó.
  const dibujar = useCallback((i, forzar = false) => {
    const canvas = canvasRef.current
    const lista = imagenes.current
    if (!canvas || !lista.length || !geo.current.w) return

    let imagen = null
    for (let d = 0; d < TOTAL && !imagen; d++) {
      for (const j of [i - d, i + d]) {
        if (lista[j]?.complete && lista[j].naturalWidth) {
          imagen = lista[j]
          break
        }
      }
    }
    if (!imagen || (!forzar && fisica.current.dibujado === imagen)) return
    fisica.current.dibujado = imagen

    const dpr = canvas.width / canvas.clientWidth || 1
    const { x, y, w, h } = geo.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(imagen, x * dpr, y * dpr, w * dpr, h * dpr)
    difuminarBordes(ctx, x * dpr, y * dpr, w * dpr, h * dpr)
  }, [])

  // Ubica el mini sitio sobre la pantalla del fotograma i (las esquinas salen de data/pantalla.json).
  const ubicarPantalla = useCallback((i, forzar = false) => {
    const el = pantallaRef.current
    const f = fisica.current
    if (!el || (!forzar && f.pantalla === i)) return
    f.pantalla = i

    const esquinas = pantalla.esquinas[i - pantalla.desde]
    const opacidad = esquinas ? suave(tramo(i, ...ENCENDIDO)) : 0
    el.style.opacity = opacidad
    if (!esquinas || !opacidad) return

    const { x, y, w, h } = geo.current
    const puntos = esquinas.map((v, k) => (k % 2 ? y + v * h : x + v * w))
    el.style.transform = matrizHacia(ANCHO_PANTALLA, ALTO_PANTALLA, puntos)
  }, [])

  const pintar = useCallback(
    (p, forzar = false) => {
      const i = fotogramaDe(p)
      dibujar(i, forzar)
      ubicarPantalla(i, forzar)
      if (indicadorRef.current) indicadorRef.current.style.transform = `translate3d(0, ${p * 72}px, 0)`
    },
    [dibujar, ubicarPantalla],
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

  // Precarga: primero el fotograma que se ve al entrar, después el resto en orden.
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
        const actual = fotogramaDe(fisica.current.actual)
        if (imagenes.current === lista && Math.abs(i - actual) <= 1) dibujar(actual, true)
      }
      imagen.src = ruta(carpeta, i)
      lista[i] = imagen
    }
    return () => lista.forEach((imagen) => (imagen.onload = null))
  }, [carpeta, reducir, dibujar])

  // Ubica la MacBook dentro del hueco que el layout le reserva (.hero-zona-mac): así el
  // diseño se arma con CSS y el canvas solo lo sigue. Recalcula al cambiar cualquier tamaño.
  useEffect(() => {
    const escenario = escenarioRef.current
    const zona = zonaRef.current
    const canvas = canvasRef.current

    function medir() {
      const e = escenario.getBoundingClientRect()
      const z = zona.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(e.width * dpr)
      canvas.height = Math.round(e.height * dpr)

      const anchoMac = Math.min(z.width / MARGEN_CERRADA, z.height / ALTO_SOBRE_ANCHO)
      const w = anchoMac / ANCHO_MAC
      const h = w * (9 / 16)
      const cx = z.left - e.left + z.width / 2
      const cy = z.top - e.top + z.height / 2
      geo.current = { x: cx - CENTRO_MAC[0] * w, y: cy - CENTRO_MAC[1] * h, w, h }
      pintar(fisica.current.actual, true)
    }

    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(escenario)
    observador.observe(zona)
    return () => observador.disconnect()
  }, [pintar])

  // Con "reducir movimiento" la MacBook queda abierta, con la pantalla encendida, sin animar.
  useEffect(() => {
    const f = fisica.current
    cancelAnimationFrame(f.frame)
    f.frame = 0
    if (reducir) f.actual = f.objetivo = 1
    else f.actual = f.objetivo
    pintar(f.actual, true)
    return () => cancelAnimationFrame(f.frame)
  }, [reducir, pintar])

  return (
    <section id="inicio" className={reducir ? 'hero hero--quieto' : 'hero'} ref={pistaRef} aria-label="Presentación">
      <div className="hero-escenario" ref={escenarioRef}>
        <canvas ref={canvasRef} className="hero-canvas" role="img" aria-label="Una MacBook que se abre" />
        <PantallaSitio perfil={perfil} refPantalla={pantallaRef} />
        <div className="hero-planta" aria-hidden="true" />

        <div className="contenedor hero-contenido">
          <div className="hero-texto">
            {perfil.disponible && (
              <p className="insignia">
                <span className="insignia-punto" aria-hidden="true" />
                Disponible para nuevos proyectos
              </p>
            )}
            <h1 className="hero-titulo">{conEnfasis(perfil.titular)}</h1>
            <p className="hero-resumen">
              Soy <strong>{primerNombre(perfil.nombre)}</strong> — {perfil.resumen}
            </p>
            <div className="hero-acciones">
              <a className="boton boton--oscuro" href="#proyectos">
                Ver mis proyectos <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a className="boton boton--contorno" href="#contacto">
                Contactame
              </a>
            </div>
            <Estadisticas estadisticas={estadisticas} />
          </div>
          <div className="hero-zona-mac" ref={zonaRef} />
        </div>

        <div className="indicador-scroll" aria-hidden="true">
          <span>Scroll</span>
          <i>
            <b ref={indicadorRef} />
          </i>
        </div>
      </div>
    </section>
  )
}
