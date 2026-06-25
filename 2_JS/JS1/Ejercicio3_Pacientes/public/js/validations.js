// aca estan las validaciones para el form de pacientes
// tenemos las regex y funciones para la edad y los estilos de error
const validations = {
    // las regex que pide el ejercicio
    regex: {
        name: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
        dni: /^\d{7,8}$/,
        phone: /^\d{10,15}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    // aca validamos campo por campo y ponemos los colores
    validateField: (input) => {
        const group = input.closest('.form-group');
        if (!group) return;

        let isValid = input.checkValidity();

        // validamos algunas cosas mas por las dudas con js
        if (input.id === 'nombre' || input.id === 'apellido' || input.id === 'emergenciaNombre') {
            if (!validations.regex.name.test(input.value)) isValid = false;
        }
        // limites de caracteres que pide la consigna
        if (input.id === 'nombre' && input.value.trim().length < 3) isValid = false;
        if (input.id === 'apellido' && input.value.trim().length < 2) isValid = false;
        if (input.id === 'emergenciaNombre' && input.value.trim().length < 3) isValid = false;

        if (input.id === 'dni' && input.value) {
            if (!validations.regex.dni.test(input.value)) isValid = false;
        }

        if ((input.id === 'telefono' || input.id === 'emergenciaTelefono') && input.value) {
            if (!validations.regex.phone.test(input.value)) isValid = false;
        }

        if ((input.id === 'email' || input.id === 'emailUser' || input.id === 'emailDomain') && input.value) {
            isValid = input.checkValidity();
        }

        // ponemos las clases de css segun si esta bien o mal
        if (isValid && input.value.trim() !== '') {
            group.classList.add('is-valid');
            group.classList.remove('is-invalid');
        } else if (!isValid && (input.value.trim() !== '' || input.hasAttribute('required'))) {
            group.classList.add('is-invalid');
            group.classList.remove('is-valid');
        } else {
            group.classList.remove('is-valid', 'is-invalid');
        }

        return isValid;
    },

    // funcion para sacar la edad exacta con la fecha de nacimiento
    calculateAge: (birthDateStr) => {
        if (!birthDateStr) return null;
        const today = new Date();
        const birthDate = new Date(birthDateStr);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
};

// lo mandamos a window para que se use en todos lados
window.appValidations = validations;
