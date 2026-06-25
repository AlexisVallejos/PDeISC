// logica para el registro de socios de river
// maneja el modal, validaciones, el mail compuesto y guardar todo en la tabla
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('socioForm');
    const submitBtn = document.getElementById('submitBtn');
    const clearBtn = document.getElementById('clearBtn');
    const btnText = form.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    const tableBody = document.getElementById('inventoryTableBody');
    const totalItemsBadge = document.getElementById('totalItems');
    const toastContainer = document.getElementById('toast-container');

    // cosas para el telefono
    const phoneCountry = document.getElementById('phoneCountry');
    const argMobilePrefix = document.getElementById('argMobilePrefix');

    // cosas para el dni/tramite
    const tipoDocumento = document.getElementById('tipo_documento');
    const tramiteGroup = document.getElementById('tramiteGroup');
    const tramiteInput = document.getElementById('tramite');

    tipoDocumento.addEventListener('change', (e) => {
        if (e.target.value === 'Documento Extranjero') {
            tramiteGroup.style.display = 'none';
            tramiteInput.removeAttribute('required');
        } else {
            tramiteGroup.style.display = 'flex';
            tramiteInput.setAttribute('required', 'true');
        }
    });

    tramiteInput.addEventListener('blur', () => {
        const val = tramiteInput.value.trim();
        if (val && val.length < 11 && /^\d+$/.test(val)) {
            tramiteInput.value = val.padStart(11, '0');
        }
    });

    // reglas de la contrasena
    const passwordInput = document.getElementById('password');
    const rules = {
        length: document.getElementById('rule-length'),
        upper: document.getElementById('rule-upper'),
        lower: document.getElementById('rule-lower'),
        number: document.getElementById('rule-number'),
        special: document.getElementById('rule-special')
    };

    // el modal de los terminos y condiciones
    const openTermsModal = document.getElementById('openTermsModal');
    const termsModal = document.getElementById('termsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const termsBody = document.getElementById('termsBody');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    const termsCheckbox = document.getElementById('termsCheckbox');

    openTermsModal.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    const closeTerms = () => {
        termsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    closeModalBtn.addEventListener('click', closeTerms);

    window.addEventListener('click', (e) => {
        if (e.target === termsModal) closeTerms();
    });

    termsBody.addEventListener('scroll', () => {
        const isAtBottom = termsBody.scrollHeight - termsBody.scrollTop <= termsBody.clientHeight + 5;
        if (isAtBottom) {
            termsCheckbox.disabled = false;
            termsCheckbox.checked = true;
            scrollDownBtn.innerHTML = '<i class="bi bi-check-all"></i> Terminos leidos y aceptados';
            scrollDownBtn.style.background = 'var(--success)';
        }
    });

    scrollDownBtn.addEventListener('click', () => {
        termsBody.scrollTo({ top: termsBody.scrollHeight, behavior: 'smooth' });
    });

    const showToast = (msg, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
        toast.innerHTML = `<i class="bi ${iconClass}"></i> <span>${msg}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    };

    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const inputs = group.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (!input.checkValidity()) {
                    group.classList.add('invalid');
                } else {
                    group.classList.remove('invalid');
                }
            });
        });
    });

    phoneCountry.addEventListener('change', (e) => {
        argMobilePrefix.style.display = e.target.value === '+54' ? 'flex' : 'none';
    });

    passwordInput.addEventListener('input', (e) => {
        const val = e.target.value;
        val.length >= 12 ? rules.length.classList.add('valid') : rules.length.classList.remove('valid');
        /[A-Z]/.test(val) ? rules.upper.classList.add('valid') : rules.upper.classList.remove('valid');
        /[a-z]/.test(val) ? rules.lower.classList.add('valid') : rules.lower.classList.remove('valid');
        /\d/.test(val) ? rules.number.classList.add('valid') : rules.number.classList.remove('valid');
        /[.!\@#\$%\^&\*\(\)\-\+\?]/.test(val) ? rules.special.classList.add('valid') : rules.special.classList.remove('valid');
    });

    const renderTable = () => {
        const items = window.inventoryStorage.getAllItems();
        tableBody.innerHTML = '';

        if (items.length === 0) {
            tableBody.innerHTML = '<tr id="emptyRow"><td colspan="5" class="empty-cell">Nadie se ha asociado en esta sesion todavia.</td></tr>';
            totalItemsBadge.textContent = '0 socios';
            return;
        }

        totalItemsBadge.textContent = `${items.length} socio${items.length !== 1 ? 's' : ''}`;

        items.forEach(item => {
            const nombreCompleto = `${item.nombre || ''} ${item.apellido || ''}`.trim();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${nombreCompleto || 'Sin nombre'}</strong></td>
                <td><strong>${item.documento}</strong></td>
                <td>${item.sexo}</td>
                <td>${item.nacionalidad}</td>
                <td>${item.email}</td>
            `;
            tableBody.appendChild(tr);
        });
    };

    renderTable();

    const clearForm = () => {
        form.reset();
        form.querySelectorAll('input, select').forEach(input => {
            const group = input.closest('.form-group');
            if (group) group.classList.remove('invalid');
        });

        Object.values(rules).forEach(el => el.classList.remove('valid'));
        argMobilePrefix.style.display = 'flex';
        tramiteGroup.style.display = 'flex';
        tramiteInput.setAttribute('required', 'true');
        termsCheckbox.checked = false;
        termsCheckbox.disabled = true;
        scrollDownBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i> Bajar hasta el final para aceptar';
        scrollDownBtn.style.background = '';

        showToast('Formulario limpiado.', 'success');
    };

    if (clearBtn) {
        clearBtn.addEventListener('click', clearForm);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            showToast('Por favor, revisa los campos en rojo.', 'error');
            form.querySelectorAll('input, select').forEach(input => {
                if (!input.checkValidity()) {
                    const group = input.closest('.form-group');
                    if (group) group.classList.add('invalid');
                }
            });
            return;
        }

        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.email = `${data.emailUser}@${data.emailDomain}${data.emailTld}`;
        delete data.emailUser;
        delete data.emailDomain;
        delete data.emailTld;

        let fullPhone = data.phoneCountry;
        if (data.phoneCountry === '+54') fullPhone += '9';
        fullPhone += data.phoneArea + data.phoneNumber;
        data.telefono = fullPhone;

        delete data.phoneCountry;
        delete data.phoneArea;
        delete data.phoneNumber;

        try {
            const response = await fetch('/api/socios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error desconocido.');

            showToast(result.message, 'success');
            window.inventoryStorage.saveItem(result.socio, data.metodo_almacenaje);
            renderTable();
            form.reset();

            Object.values(rules).forEach(el => el.classList.remove('valid'));
            argMobilePrefix.style.display = 'flex';
        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
        } finally {
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
