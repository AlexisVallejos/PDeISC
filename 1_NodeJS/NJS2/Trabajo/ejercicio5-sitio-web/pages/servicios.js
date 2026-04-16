export default function Servicios() {
  const servicios = [
    { titulo: 'Desarrollo Web',       desc: 'Creamos sitios modernos con las últimas tecnologías.' },
    { titulo: 'Apps Móviles',          desc: 'Aplicaciones iOS y Android con React Native.' },
    { titulo: 'APIs REST',             desc: 'Diseño e implementación de APIs escalables con Node.js.' },
    { titulo: 'Base de Datos',         desc: 'Modelado y optimización con SQL y NoSQL.' },
    { titulo: 'Despliegue en la Nube', desc: 'Infraestructura en AWS, Vercel y Netlify.' },
  ];

  return (
    <main>
      <h1>Servicios</h1>
      <p>Ofrecemos soluciones completas para tu proyecto digital.</p>
      <div className="grid">
        {servicios.map(({ titulo, desc }) => (
          <div className="card" key={titulo}>
            <h2>{titulo}</h2>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
