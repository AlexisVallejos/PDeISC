// logica principal del cliente

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const clearBtn = document.getElementById('clearBtn');
    const btnText = form.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    const usersList = document.getElementById('usersList');
    const emptyState = document.getElementById('emptyState');
    const methodSelect = document.getElementById('jsMethod');
    const toastContainer = document.getElementById('toast-container');

    // mostramos los toasts para no usar alerts feos
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill';
        toast.innerHTML = `<i class="bi ${iconClass}"></i><p>${message}</p>`;
        
        toastContainer.appendChild(toast);

        // lo sacamos del dom despues de 5 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                toastContainer.removeChild(toast);
            }
        }, 5000);
    };

    // validacion visual mientras el usuario escribe
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const group = input.closest('.input-group');
            if (!input.checkValidity()) {
                group.classList.add('invalid');
            } else {
                group.classList.remove('invalid');
            }
        });
    });

    const clearForm = () => {
        form.reset();
        inputs.forEach(input => input.closest('.input-group').classList.remove('invalid'));
        showToast('Formulario limpiado.', 'success');
    };

    if (clearBtn) {
        clearBtn.addEventListener('click', clearForm);
    }

    // agregamos al pibe a la lista sin recargar
    const addUserToList = (user) => {
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        const li = document.createElement('li');
        li.className = 'user-card';
        
        // sacamos la inicial para el circulo del avatar
        const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';

        li.innerHTML = `
            <div class="user-avatar">${initial}</div>
            <div class="user-info">
                <span class="user-name">${user.name} ${user.surname}</span>
                <span class="user-email">${user.email}</span>
            </div>
        `;
        
        // lo ponemos arriba de todo
        usersList.insertBefore(li, usersList.firstChild);
    };

    // aca mandamos el form
    form.addEventListener('submit', async (e) => {
        // cortamos el submit para que no se recargue la pagina
        e.preventDefault();

        // checkeamos si el html dice que esta todo ok
        if (!form.checkValidity()) {
            showToast('Por favor, corrige los errores en el formulario.', 'error');
            // mostramos los errores si falta algo
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.closest('.input-group').classList.add('invalid');
                }
            });
            return;
        }

        // vemos que metodo eligio el usuario para leer los datos
        const method = methodSelect.value;
        let formDataObj = {};

        // sacamos los datos del form segun el metodo
        if (method === '1') {
            formDataObj = window.formHandlers.readById();
            console.log('Datos extraídos por ID:', formDataObj);
        } else if (method === '2') {
            formDataObj = window.formHandlers.readByDocumentForms();
            console.log('Datos extraídos por document.forms:', formDataObj);
        } else {
            formDataObj = window.formHandlers.readByFormData(form);
            console.log('Datos extraídos por FormData:', formDataObj);
        }

        // desactivamos el boton y ponemos el cargando
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        try {
            // mandamos todo al server
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObj)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en el registro');
            }

            // si salio todo bien avisamos y actualizamos la lista
            showToast(data.message, 'success');
            
            // lo metemos en la lista dinamica
            addUserToList(data.user);
            
            // reseteamos todo el form y sacamos los bordes rojos
            form.reset();
            inputs.forEach(input => input.closest('.input-group').classList.remove('invalid'));

        } catch (error) {
            console.error('Error:', error);
            showToast(error.message, 'error');
        } finally {
            // volvemos a poner el boton como antes
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }
    });
});


// Inicializa tema, boton de tema y boton para volver arriba.
function initUiExtras() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const topBtn = document.getElementById('scrollTopBtn');

    const pintarBotonTema = (tema) => {
        if (!themeBtn) return;
        const icono = tema === 'dark' ? 'sun' : 'moon';
        const texto = tema === 'dark' ? 'Modo claro' : 'Modo oscuro';
        themeBtn.innerHTML = `<i data-lucide="${icono}" aria-hidden="true"></i><span>${texto}</span>`;
        if (window.lucide) window.lucide.createIcons();
    };

    if (window.themeConfig) {
        const t = window.themeConfig.getTheme();
        window.themeConfig.applyTheme(t);
        pintarBotonTema(t);

        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const next = window.themeConfig.toggleTheme();
                pintarBotonTema(next);
            });
        }
    }

    if (topBtn) {
        const handleScroll = () => {
            topBtn.style.display = window.scrollY > 220 ? 'inline-flex' : 'none';
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (window.lucide) window.lucide.createIcons();
}

initUiExtras();
