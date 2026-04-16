const posts = [
  {
    titulo: '¿Qué es Node.js y para qué sirve?',
    fecha: '10 Abr 2026',
    resumen: 'Una introducción al entorno de ejecución JavaScript del lado del servidor.',
  },
  {
    titulo: 'Módulos en Node.js: require vs import',
    fecha: '5 Abr 2026',
    resumen: 'Diferencias entre CommonJS y ES Modules con ejemplos prácticos.',
  },
  {
    titulo: 'Crear un servidor HTTP desde cero',
    fecha: '1 Abr 2026',
    resumen: 'Cómo usar el módulo http de Node.js sin Express.',
  },
  {
    titulo: 'NPM: gestión de paquetes explicada',
    fecha: '25 Mar 2026',
    resumen: 'Guía completa sobre package.json, npm install y scripts.',
  },
];

export default function Blog() {
  return (
    <main>
      <h1>Blog</h1>
      <p>Artículos sobre desarrollo web y Node.js.</p>
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {posts.map(({ titulo, fecha, resumen }) => (
          <div className="card" key={titulo}>
            <p style={{ fontSize: '0.8rem', color: '#a0aec0', marginBottom: 4 }}>{fecha}</p>
            <h2>{titulo}</h2>
            <p>{resumen}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
