import { useEffect } from 'react'
import BarraNav from './components/BarraNav'
import BotonSubir from './components/BotonSubir'
import Contacto from './components/Contacto'
import Experiencia from './components/Experiencia'
import HeroMacbook from './components/HeroMacbook'
import Pie from './components/Pie'
import Proyectos from './components/Proyectos'
import SobreMi from './components/SobreMi'
import { TemaProvider } from './context/TemaContext'
import { usePortfolio } from './hooks/usePortfolio'
import { detenerScrollSuave, iniciarScrollSuave } from './utils/scrollSuave'

export default function App() {
  const { datos, fuente, visitas } = usePortfolio()
  const { perfil, estadisticas = [], habilidades, experiencias, logros, proyectos, resenas = [] } = datos

  useEffect(() => {
    iniciarScrollSuave()
    return detenerScrollSuave
  }, [])

  return (
    <TemaProvider>
      <a className="saltar" href="#proyectos">
        Saltar al contenido
      </a>
      <BarraNav nombre={perfil.nombre} />
      <main>
        <HeroMacbook perfil={perfil} estadisticas={estadisticas} />
        {/* El resto del contenido sube como una hoja sobre el hero cuando termina la animación. */}
        <div className="hoja">
          <Proyectos proyectos={proyectos} />
          <Experiencia experiencias={experiencias} habilidades={habilidades} resenas={resenas} />
          <SobreMi perfil={perfil} habilidades={habilidades} logros={logros} />
          <Contacto />
        </div>
      </main>
      <Pie nombre={perfil.nombre} fuente={fuente} visitas={visitas} />
      <BotonSubir />
    </TemaProvider>
  )
}
