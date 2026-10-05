import Lenis from 'lenis'

// Scroll suave para toda la página con Lenis: la rueda del mouse y el trackpad
// se interpolan (en vez de saltar de a 100 px) y los enlaces #ancla se deslizan.
// En el celular queda el scroll nativo, que ya tiene inercia. Con "reducir movimiento"
// Lenis desactiva el suavizado solo.
let lenis = null

export function iniciarScrollSuave() {
  if (lenis) return lenis
  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 1,
    autoRaf: true,
    anchors: { offset: -64 },
    stopInertiaOnNavigate: true,
  })
  return lenis
}

export function detenerScrollSuave() {
  lenis?.destroy()
  lenis = null
}

// Mientras hay un diálogo abierto la página no se mueve por detrás.
export const pausarScroll = () => lenis?.stop()
export const reanudarScroll = () => lenis?.start()

export function scrollArriba() {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
