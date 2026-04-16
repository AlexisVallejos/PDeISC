import { useState } from 'react';

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <main>
      <h1>Contacto</h1>
      <p>Completá el formulario y nos comunicamos a la brevedad.</p>

      {enviado ? (
        <div className="card" style={{ marginTop: 32, textAlign: 'center' }}>
          <h2>¡Mensaje enviado!</h2>
          <p>Gracias por escribirnos. Te responderemos pronto.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: 32, maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Nombre',  type: 'text',  name: 'nombre',  placeholder: 'Tu nombre' },
            { label: 'Email',   type: 'email', name: 'email',   placeholder: 'tu@email.com' },
            { label: 'Asunto',  type: 'text',  name: 'asunto',  placeholder: 'Asunto' },
          ].map(({ label, type, name, placeholder }) => (
            <div key={name}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>{label}</label>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e0', fontSize: '0.95rem' }}
              />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Mensaje</label>
            <textarea
              name="mensaje"
              rows={5}
              required
              placeholder="Escribí tu mensaje..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #cbd5e0', fontSize: '0.95rem', resize: 'vertical' }}
            />
          </div>
          <button type="submit" className="btn" style={{ cursor: 'pointer', border: 'none' }}>
            Enviar mensaje
          </button>
        </form>
      )}
    </main>
  );
}
