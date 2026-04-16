export default function Portafolio() {
  const proyectos = [
    { nombre: 'E-commerce XYZ',   tech: 'Next.js · Stripe · MongoDB',   desc: 'Tienda online con pagos integrados.' },
    { nombre: 'Dashboard Admin',   tech: 'React · Node.js · PostgreSQL', desc: 'Panel de administración en tiempo real.' },
    { nombre: 'App de Clima',      tech: 'Node.js · API OpenWeather',    desc: 'App de pronóstico del tiempo con módulos propios.' },
    { nombre: 'Blog Personal',     tech: 'Next.js · MDX',               desc: 'Blog estático con soporte Markdown.' },
    { nombre: 'Sistema de Tareas', tech: 'React · Express · SQLite',    desc: 'Gestor de tareas con arrastrar y soltar.' },
  ];

  return (
    <main>
      <h1>Portafolio</h1>
      <p>Algunos proyectos en los que trabajamos.</p>
      <div className="grid">
        {proyectos.map(({ nombre, tech, desc }) => (
          <div className="card" key={nombre}>
            <h2>{nombre}</h2>
            <p style={{ fontSize: '0.8rem', color: '#718096', marginBottom: 8 }}>{tech}</p>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
