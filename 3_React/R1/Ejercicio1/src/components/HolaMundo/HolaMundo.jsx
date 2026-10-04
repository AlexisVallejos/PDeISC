// Ejercicio 1: componente que muestra "¡Hola, mundo!" con distintos estilos CSS.
import './HolaMundo.css'

function HolaMundo() {
  return (
    // JSX: parece HTML pero es JavaScript. "className" se usa en lugar de "class".
    <div className="hola-contenedor">
      {/* Mismo texto, tres clases distintas: cada clase tiene su estilo en HolaMundo.css */}
      <p className="hola hola--clasico">¡Hola, mundo!</p>
      <p className="hola hola--degradado">¡Hola, mundo!</p>
      <p className="hola hola--tarjeta">¡Hola, mundo!</p>
    </div>
  )
}

export default HolaMundo
