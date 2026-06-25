document.addEventListener('DOMContentLoaded', () => {
  const formContacto = document.getElementById('formulario-contacto');
  if (!formContacto) return;

  const btnSubmit = document.getElementById('btn-submit');
  const emailInput = document.getElementById('email');

  // Regex estricto para validar Gmail
  const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){5,29}@gmail\.com$/;

  // Validación en tiempo real del correo
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const val = emailInput.value.trim();
      if (val.length === 0) {
        emailInput.classList.remove('is-valid', 'is-invalid');
      } else if (emailRegex.test(val)) {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
      } else {
        emailInput.classList.remove('is-valid');
        emailInput.classList.add('is-invalid');
      }
    });
  }

  formContacto.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailVal = emailInput.value.trim();
    if (!emailRegex.test(emailVal)) {
      e.stopPropagation();
      emailInput.classList.add('is-invalid');
      emailInput.focus();
      return;
    }

    if (!formContacto.checkValidity()) {
      e.stopPropagation();
      formContacto.classList.add('was-validated');
      return;
    }

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = emailVal;
    const telefono = document.getElementById('telefono').value.trim() || 'No especificado';
    const motivo = document.getElementById('motivo').value;
    const mensaje = document.getElementById('mensaje').value.trim();
    const urlNota = document.getElementById('url-nota') ? document.getElementById('url-nota').value.trim() : '';

    const originalText = btnSubmit.innerText;
    btnSubmit.innerText = 'Enviando mensaje...';
    btnSubmit.disabled = true;

    // Enviar a FormSubmit.co (sin backend, sin node)
    fetch("https://formsubmit.co/ajax/vasescompany912@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        _subject: `Nuevo contacto: ${motivo.toUpperCase()} de ${nombre}`,
        nombre: `${nombre} ${apellido}`,
        email: email,
        telefono: telefono,
        motivo: motivo,
        url_nota: urlNota || 'N/A',
        mensaje: mensaje,
        _template: "table"
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Contacto enviado:", data);

      btnSubmit.innerText = '¡Mensaje Enviado!';
      btnSubmit.style.backgroundColor = '#198754';
      btnSubmit.style.borderColor = '#198754';

      setTimeout(() => {
        formContacto.reset();
        formContacto.classList.remove('was-validated');
        emailInput.classList.remove('is-valid', 'is-invalid');
        btnSubmit.innerText = originalText;
        btnSubmit.style.backgroundColor = '';
        btnSubmit.style.borderColor = '';
        btnSubmit.disabled = false;

        Swal.fire({
          icon: 'success',
          title: '¡Mensaje enviado con éxito!',
          html: `
            <div style="text-align: left; font-size: 0.95rem; line-height: 1.7;">
              <p>Tu mensaje fue enviado a la redacción de <strong>Pepitos Informa</strong>.</p>
              <p>Nuestro equipo revisará tu consulta y te responderá a <strong>${email}</strong> a la brevedad.</p>
              <p style="margin-top: 12px; color: #6c757d; font-size: 0.85rem;">Horario de atención: Lunes a viernes de 9:00 a 18:00 hs (UTC−3).</p>
            </div>
          `,
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#800e13',
          backdrop: 'rgba(0,0,0,0.8)'
        });
      }, 1000);
    })
    .catch(err => {
      console.error("Error al enviar contacto:", err);
      btnSubmit.innerText = originalText;
      btnSubmit.disabled = false;

      Swal.fire({
        icon: 'error',
        title: 'Error al enviar',
        text: 'Hubo un problema al enviar tu mensaje. Por favor, intentá de nuevo.',
        confirmButtonColor: '#800e13',
        backdrop: 'rgba(0,0,0,0.8)'
      });
    });
  });

  // Mostrar el campo de URL si el motivo es "error"
  const motivoSelect = document.getElementById('motivo');
  const campoUrl = document.getElementById('campo-url');

  if (motivoSelect && campoUrl) {
    motivoSelect.addEventListener('change', (e) => {
      if (e.target.value === 'error') {
        campoUrl.style.display = 'block';
        document.getElementById('url-nota').setAttribute('required', 'true');
      } else {
        campoUrl.style.display = 'none';
        document.getElementById('url-nota').removeAttribute('required');
      }
    });
  }
});
