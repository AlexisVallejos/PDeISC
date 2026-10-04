// Ejercicio 3: contador con botones para sumar y restar. El valor vive en el estado.
import { useState } from 'react'
import './Contador.css'

function Contador() {
  // useState devuelve [valor actual, función para cambiarlo]. Empieza en 0.
  const [valor, setValor] = useState(0)

  return (
    <div className="contador">
      <button
        className="contador__boton contador__boton--restar"
        onClick={() => setValor(valor - 1)}
        aria-label="Restar uno"
      >
        −
      </button>
      {/* aria-live avisa a los lectores de pantalla cuando el número cambia */}
      <output className="contador__valor" aria-live="polite">
        {valor}
      </output>
      <button
        className="contador__boton"
        onClick={() => setValor(valor + 1)}
        aria-label="Sumar uno"
      >
        +
      </button>
    </div>
  )
}

export default Contador
