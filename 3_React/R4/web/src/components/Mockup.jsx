// Dispositivo dibujado con CSS para las tarjetas de proyecto que todavía no tienen imagen
// (columna `imagen` de portfolio_proyectos). Las apps de React Native van en un celular;
// el resto, alternando, en una notebook o una tablet. Todos apoyados sobre una piedra.
export default function Mockup({ proyecto, tema, indice }) {
  const esMovil = proyecto.tecnologias.some((t) => /react native|expo/i.test(t))
  const dispositivo = esMovil ? 'celular' : indice % 2 ? 'tablet' : 'notebook'

  return (
    <div className={`mockup mockup--${dispositivo} mockup--${tema}`}>
      <div className="mockup-piedra" />
      <div className="mockup-equipo">
        <div className="mockup-pantalla">
          {esMovil ? <UiCelular titulo={proyecto.lema} /> : <UiEscritorio titulo={proyecto.titulo} />}
        </div>
      </div>
    </div>
  )
}

function UiEscritorio({ titulo }) {
  return (
    <div className="ui-escritorio">
      <div className="ui-lateral">
        <b>{titulo}</b>
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} className={i === 1 ? 'es-activo' : ''} />
        ))}
      </div>
      <div className="ui-principal">
        <div className="ui-tarjetas">
          <i />
          <i />
          <i />
        </div>
        <div className="ui-grafico">
          {[38, 62, 45, 80, 56, 92, 70].map((alto, i) => (
            <i key={i} style={{ height: `${alto}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function UiCelular({ titulo }) {
  return (
    <div className="ui-celular">
      <i className="ui-isla" />
      <b>{titulo.split(' ').slice(0, 2).join(' ')}</b>
      <div className="ui-foto" />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="ui-fila">
          <i />
          <span />
        </div>
      ))}
    </div>
  )
}
