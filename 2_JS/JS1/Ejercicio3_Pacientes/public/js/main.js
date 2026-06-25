// logica para el registro de pacientes medicore
// maneja la edad, el mail compuesto y el localstorage para el listado de pacientes
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('patientForm');
    const submitBtn = document.getElementById('submitBtn');
    const clearBtn = document.getElementById('clearBtn');
    const btnText = form.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    const patientTableBody = document.getElementById('patientTableBody');
    const totalItemsBadge = document.getElementById('totalItems');
    const toastContainer = document.getElementById('toast-container');
    const fullNamesListPacientes = document.getElementById('fullNamesListPacientes');

    const birthDateInput = document.getElementById('fechaNacimiento');
    const ageInput = document.getElementById('edad');
    const underageAlert = document.getElementById('underageAlert');
    const hijosContainer = document.getElementById('hijosContainer');
    const tieneHijosRadios = document.getElementsByName('tieneHijos');

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
            window.appValidations.validateField(tramiteInput);
        }
    });

    const showToast = (msg, type = 'success') => {
        const toast = document.createElement('div');
        const iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-octagon-fill';
        toast.innerHTML = `<i class="bi ${iconClass}"></i> <span>${msg}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    const renderTable = () => {
        const stored = localStorage.getItem('pacientes_data');
        const patients = stored ? JSON.parse(stored) : [];
        patientTableBody.innerHTML = '';

        if (patients.length === 0) {
            patientTableBody.innerHTML = '<tr id="emptyRow"><td colspan="3" class="empty-cell">Sin registros en sesion.</td></tr>';
            totalItemsBadge.textContent = '0 pacientes';
            if (fullNamesListPacientes) {
                fullNamesListPacientes.innerHTML = '<li class="empty-cell">Sin registros en sesion.</li>';
            }
            return;
        }

        totalItemsBadge.textContent = `${patients.length} paciente${patients.length !== 1 ? 's' : ''}`;

        if (fullNamesListPacientes) {
            fullNamesListPacientes.innerHTML = '';
            patients.forEach((p) => {
                const nombreCompletoListado = `${p.nombre || ''} ${p.apellido || ''}`.trim();
                const li = document.createElement('li');
                li.textContent = nombreCompletoListado || 'Paciente sin nombre';
                fullNamesListPacientes.appendChild(li);
            });
        }

        patients.forEach((p) => {
            const tr = document.createElement('tr');
            const nombreCompleto = `${p.nombre || ''} ${p.apellido || ''}`.trim();
            tr.innerHTML = `
                <td><strong>${nombreCompleto}</strong></td>
                <td>${p.edad ?? '-'} anios</td>
                <td><span class="badge" style="background:#0ea5e9">${p.obraSocial}</span></td>
            `;
            patientTableBody.appendChild(tr);
        });
    };

    renderTable();

    const allInputs = form.querySelectorAll('input, select, textarea');

    const clearForm = () => {
        form.reset();
        allInputs.forEach((input) => {
            const group = input.closest('.form-group');
            if (group) group.classList.remove('is-valid', 'is-invalid');
        });

        underageAlert.style.display = 'none';
        hijosContainer.style.display = 'none';
        const cantidadHijos = document.getElementById('cantidadHijos');
        cantidadHijos.value = '';
        cantidadHijos.removeAttribute('required');

        tramiteGroup.style.display = 'flex';
        tramiteInput.setAttribute('required', 'true');

        showToast('Formulario limpiado.', 'success');
    };

    if (clearBtn) {
        clearBtn.addEventListener('click', clearForm);
    }

    allInputs.forEach((input) => {
        input.addEventListener('input', () => {
            window.appValidations.validateField(input);
        });
        input.addEventListener('blur', () => {
            window.appValidations.validateField(input);
        });
    });

    tieneHijosRadios.forEach((radio) => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Si') {
                hijosContainer.style.display = 'flex';
                document.getElementById('cantidadHijos').setAttribute('required', 'true');
            } else {
                hijosContainer.style.display = 'none';
                document.getElementById('cantidadHijos').removeAttribute('required');
                document.getElementById('cantidadHijos').value = '';
            }
        });
    });

    birthDateInput.addEventListener('change', (e) => {
        const age = window.appValidations.calculateAge(e.target.value);
        if (age !== null) {
            ageInput.value = age;
            window.appValidations.validateField(ageInput);
            underageAlert.style.display = age < 18 && age >= 0 ? 'block' : 'none';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const stored = localStorage.getItem('pacientes_data');
        const patients = stored ? JSON.parse(stored) : [];

        const currentTramite = document.getElementById('tramite').value.trim();
        const emailUser = document.getElementById('emailUser').value.trim();
        const emailDomain = document.getElementById('emailDomain').value.trim();
        const emailTld = document.getElementById('emailTld').value;
        const currentEmail = `${emailUser}@${emailDomain}${emailTld}`;

        const isTramiteDuplicated = patients.some((p) => p.tramite === currentTramite);
        const isEmailDuplicated = patients.some((p) => p.email === currentEmail);

        if (currentTramite && isTramiteDuplicated) {
            showToast('Error: El numero de tramite ya esta registrado.', 'error');
            document.getElementById('tramite').closest('.form-group').classList.add('is-invalid');
            return;
        }
        if (isEmailDuplicated) {
            showToast('Error: El Email ya esta registrado.', 'error');
            document.getElementById('emailUser').closest('.form-group').classList.add('is-invalid');
            return;
        }

        let isFormValid = true;
        allInputs.forEach((input) => {
            if (!window.appValidations.validateField(input)) isFormValid = false;
        });

        if (!isFormValid || !form.checkValidity()) {
            showToast('Por favor, corrija los errores en el formulario.', 'error');
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.email = currentEmail;

        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        try {
            const response = await fetch('/api/pacientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error al registrar el paciente.');

            patients.push(result.paciente);
            localStorage.setItem('pacientes_data', JSON.stringify(patients));

            showToast('Paciente registrado con exito.', 'success');
            form.reset();

            allInputs.forEach((input) => {
                const group = input.closest('.form-group');
                if (group) group.classList.remove('is-valid', 'is-invalid');
            });
            underageAlert.style.display = 'none';
            hijosContainer.style.display = 'none';

            renderTable();
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
