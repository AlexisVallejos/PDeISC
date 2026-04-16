import Link from 'next/link';
import styles from '../styles/globals.css';

export default function Inicio() {
  return (
    <main>
      <section className="hero">
        <h1>Bienvenido a MiSitio</h1>
        <p>Un sitio construido con Next.js y módulos propios de Node.js</p>
        <br />
        <Link href="/servicios" className="btn">Ver servicios</Link>
      </section>

      <h2>¿Qué ofrecemos?</h2>
      <div className="grid">
        {[
          { titulo: 'Diseño Web', desc: 'Sitios modernos y responsivos.' },
          { titulo: 'Desarrollo',  desc: 'Apps robustas con Node.js y React.' },
          { titulo: 'Consultoría', desc: 'Asesoramiento técnico a medida.' },
          { titulo: 'Soporte',     desc: 'Atención continua 24/7.' },
        ].map(({ titulo, desc }) => (
          <div className="card" key={titulo}>
            <h2>{titulo}</h2>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
