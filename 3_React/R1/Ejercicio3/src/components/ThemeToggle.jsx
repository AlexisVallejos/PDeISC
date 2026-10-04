import { useTema } from '../Context/useTema.js'

// Muestro un control accesible para alternar el modo de color.
export default function ThemeToggle() {
  const { tema, alternarTema } = useTema()
  const estaOscuro = tema === 'oscuro'

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={alternarTema}
      aria-label={estaOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-pressed={estaOscuro}
    >
      <span className="theme-toggle__icon" aria-hidden="true">{estaOscuro ? '☀' : '☾'}</span>
      <span>{estaOscuro ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  )
}
