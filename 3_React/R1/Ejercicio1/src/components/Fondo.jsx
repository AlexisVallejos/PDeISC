import { useEffect, useState } from 'react'
import { useTema } from '../Context/useTema.js'
import Topography from './Topography.jsx'

// Colores de sistema de Apple para cada tema.
const COLORES = {
  claro: { lowColor: '#0071e3', midColor: '#af52de', highColor: '#ff2d55', opacity: 0.32 },
  oscuro: { lowColor: '#0a84ff', midColor: '#bf5af2', highColor: '#64d2ff', opacity: 0.55 }
}

// Detecto si el sistema pide reducir el movimiento.
function useMovimientoReducido() {
  const consulta = '(prefers-reduced-motion: reduce)'
  const [reducido, setReducido] = useState(() => window.matchMedia(consulta).matches)

  useEffect(() => {
    const medios = window.matchMedia(consulta)
    const actualizar = () => setReducido(medios.matches)
    medios.addEventListener('change', actualizar)
    return () => medios.removeEventListener('change', actualizar)
  }, [])

  return reducido
}

// Dibujo el fondo topográfico fijo detrás de toda la página.
export default function Fondo() {
  const { tema } = useTema()
  const reducido = useMovimientoReducido()

  return (
    <div className="fondo" aria-hidden="true">
      <Topography
        {...COLORES[tema]}
        speed={reducido ? 0 : 0.35}
        morphAmount={3.0}
        morphSpeed={0.05}
        bands={2.0}
        thickness={0.01}
        glow={0.5}
        contrast={3.0}
        grainIntensity={0.04}
        mouseInteraction={!reducido}
        mouseRadius={0.3}
        mouseStrength={0.4}
      />
    </div>
  )
}
