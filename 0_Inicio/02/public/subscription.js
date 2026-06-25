document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('subscribe-form');
  const emailInput = document.getElementById('subscribe-email');
  const submitBtn = document.getElementById('subscribe-btn');
  const popupCheck = document.getElementById('toggle-popup');

  // Regex estricto para validar Gmail
  const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){5,29}@gmail\.com$/;

  // --- Validación en tiempo real ---
  if (emailInput) {
    const feedbackInvalid = document.createElement('div');
    feedbackInvalid.className = 'subs-feedback subs-error';
    feedbackInvalid.textContent = 'Ingresá un Gmail válido (letras, números, puntos sin repetir, entre 6 y 30 caracteres antes del @).';
    emailInput.parentNode.appendChild(feedbackInvalid);

    const feedbackValid = document.createElement('div');
    feedbackValid.className = 'subs-feedback subs-success';
    feedbackValid.textContent = '✓ Gmail válido';
    emailInput.parentNode.appendChild(feedbackValid);

    emailInput.addEventListener('input', () => {
      const val = emailInput.value.trim();
      if (val.length === 0) {
        emailInput.classList.remove('subs-input-valid', 'subs-input-invalid');
        feedbackInvalid.style.display = 'none';
        feedbackValid.style.display = 'none';
        submitBtn.disabled = false;
      } else if (emailRegex.test(val)) {
        emailInput.classList.remove('subs-input-invalid');
        emailInput.classList.add('subs-input-valid');
        feedbackInvalid.style.display = 'none';
        feedbackValid.style.display = 'block';
        submitBtn.disabled = false;
      } else {
        emailInput.classList.remove('subs-input-valid');
        emailInput.classList.add('subs-input-invalid');
        feedbackInvalid.style.display = 'block';
        feedbackValid.style.display = 'none';
        submitBtn.disabled = true;
      }
    });
  }

  // --- Interceptar apertura si ya está suscrito ---
  if (popupCheck) {
    popupCheck.addEventListener('change', () => {
      if (popupCheck.checked) {
        const yaEmail = localStorage.getItem('pepito_suscrito');
        if (yaEmail) {
          popupCheck.checked = false;
          Swal.fire({
            icon: 'info',
            title: '¡Ya estás suscrito!',
            html: `El correo <strong>${yaEmail}</strong> ya está registrado.<br>Vas a seguir recibiendo todas las noticias.`,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#800e13',
            backdrop: 'rgba(0,0,0,0.8)'
          });
        }
      }
    });
  }

  // --- Envío del formulario ---
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();

      if (!email) {
        emailInput.classList.add('subs-input-invalid');
        emailInput.focus();
        return;
      }

      if (!emailRegex.test(email)) {
        emailInput.classList.add('subs-input-invalid');
        emailInput.focus();
        Swal.fire({
          icon: 'error',
          title: 'Correo inválido',
          text: 'Por favor, ingresá una dirección de Gmail válida.',
          confirmButtonColor: '#800e13',
          backdrop: 'rgba(0,0,0,0.8)'
        });
        return;
      }

      const yaEmail = localStorage.getItem('pepito_suscrito');
      if (yaEmail) {
        popupCheck.checked = false;
        Swal.fire({
          icon: 'info',
          title: '¡Ya estás suscrito!',
          html: `El correo <strong>${yaEmail}</strong> ya está registrado.<br>Vas a seguir recibiendo todas las noticias.`,
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#800e13',
          backdrop: 'rgba(0,0,0,0.8)'
        });
        return;
      }

      // Estado de carga
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Enviando...';
      submitBtn.disabled = true;

      // Enviar email real usando FormSubmit.co (sin backend)
      fetch("https://formsubmit.co/ajax/vasescompany912@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: "¡Nueva suscripción a Pepitos Informa!",
          email: email,
          mensaje: `El usuario ${email} se ha suscrito al boletín de Pepitos Informa.`,
          _template: "box"
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log("Suscripción enviada:", data);
      })
      .catch(err => {
        console.error("Error al enviar suscripción:", err);
      });

      setTimeout(() => {
        submitBtn.innerText = '¡Listo!';
        submitBtn.classList.replace('btn-primary', 'btn-success');

        localStorage.setItem('pepito_suscrito', email);

        setTimeout(() => {
          popupCheck.checked = false;

          submitBtn.innerText = originalText;
          submitBtn.classList.replace('btn-success', 'btn-primary');
          submitBtn.disabled = false;
          emailInput.value = '';
          emailInput.classList.remove('subs-input-valid', 'subs-input-invalid');

          Swal.fire({
            icon: 'success',
            title: '¡Suscripción exitosa!',
            html: `
              <div style="text-align: left; font-size: 0.95rem; line-height: 1.7;">
                <p>Tu correo <strong>${email}</strong> fue registrado correctamente.</p>
                <p>Te acabamos de enviar un email de bienvenida.</p>
                <p>A partir de ahora vas a recibir:</p>
                <ul style="margin-top: 8px;">
                  <li>📰 Las noticias más importantes del día</li>
                  <li>⚡ Alertas de última hora</li>
                </ul>
              </div>
            `,
            confirmButtonText: '¡Genial!',
            confirmButtonColor: '#800e13',
            backdrop: 'rgba(0,0,0,0.8)'
          });
        }, 600);

      }, 1500);
    });
  }
});
