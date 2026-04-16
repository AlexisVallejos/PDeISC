export default function Nosotros() {
  return (
    <main>
      <h1>Nosotros</h1>
      <p>
        Somos un equipo apasionado por el desarrollo web con más de 5 años de
        experiencia construyendo soluciones digitales.
      </p>
      <p>
        Nuestro stack principal incluye <strong>Node.js</strong>,{' '}
        <strong>React</strong> y <strong>Next.js</strong>.
      </p>

      <div className="grid" style={{ marginTop: 32 }}>
        {[
          { nombre: 'Ana López',    rol: 'Frontend Developer' },
          { nombre: 'Carlos Díaz',  rol: 'Backend Developer' },
          { nombre: 'María García', rol: 'UX / UI Designer' },
        ].map(({ nombre, rol }) => (
          <div className="card" key={nombre}>
            <h2>{nombre}</h2>
            <p>{rol}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
