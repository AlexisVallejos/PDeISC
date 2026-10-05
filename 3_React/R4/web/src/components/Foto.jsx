import { useState } from 'react'

function iniciales(nombre = '') {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('')
}

// Foto de perfil. Si todavía no subiste web/public/foto.jpg (o la URL falla), muestra tus iniciales.
export default function Foto({ src, nombre, className = '' }) {
  const [fallo, setFallo] = useState(false)

  return (
    <div className={`foto ${className}`}>
      {src && !fallo ? (
        <img src={src} alt={`Foto de ${nombre}`} onError={() => setFallo(true)} draggable="false" />
      ) : (
        <span className="foto-iniciales" aria-label={`Foto de ${nombre}`} role="img">
          {iniciales(nombre)}
        </span>
      )}
    </div>
  )
}
