import BarraNav from './components/BarraNav'
import Contacto from './components/Contacto'
import Experiencia from './components/Experiencia'
import Habilidades from './components/Habilidades'
import HeroMacbook from './components/HeroMacbook'
import Logros from './components/Logros'
import Pie from './components/Pie'
import Proyectos from './components/Proyectos'
import SobreMi from './components/SobreMi'
import { usePortfolio } from './hooks/usePortfolio'

export default function App() {
  const { datos, fuente, visitas } = usePortfolio()
  const { perfil, habilidades, experiencias, logros, proyectos } = datos

  return (
    <>
      <a className="saltar" href="#proyectos">
        Saltar al contenido
      </a>
      <BarraNav nombre={perfil.nombre} />
      <main>
        <HeroMacbook perfil={perfil} />
        <Proyectos proyectos={proyectos} />
        <SobreMi perfil={perfil}>
          <Habilidades habilidades={habilidades} />
          <Experiencia experiencias={experiencias} />
          <Logros logros={logros} />
        </SobreMi>
        <Contacto />
      </main>
      <Pie nombre={perfil.nombre} fuente={fuente} visitas={visitas} />
    </>
  )
}
