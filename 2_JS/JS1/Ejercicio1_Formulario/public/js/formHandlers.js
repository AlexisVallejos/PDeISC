// aca estan las funciones para leer el form de las 3 maneras que pide la consigna

const formHandlers = {
    // primera forma: usando getelementbyid para cada campo
    readById: () => {
        const name = document.getElementById('name').value.trim();
        const surname = document.getElementById('surname').value.trim();
        
        const emailUser = document.getElementById('emailUser').value.trim();
        const emailDomain = document.getElementById('emailDomain').value.trim();
        const emailTld = document.getElementById('emailTld').value.trim();
        const email = `${emailUser}@${emailDomain}${emailTld}`;
        
        return { name, surname, email };
    },

    // segunda forma: usando document.forms que es mas viejo pero sirve
    readByDocumentForms: () => {
        const form = document.forms['registrationForm']; 
        
        const name = form.elements['name'].value.trim();
        const surname = form.elements['surname'].value.trim();
        
        const emailUser = form.elements['emailUser'].value.trim();
        const emailDomain = form.elements['emailDomain'].value.trim();
        const emailTld = form.elements['emailTld'].value.trim();
        const email = `${emailUser}@${emailDomain}${emailTld}`;

        return { name, surname, email };
    },

    // tercera forma: usando formdata que es lo mas moderno y comodo
    readByFormData: (formElement) => {
        const formData = new FormData(formElement);
        
        const data = Object.fromEntries(formData.entries());
        
        for (let key in data) {
            if (typeof data[key] === 'string') {
                data[key] = data[key].trim();
            }
        }
        
        // armamos el mail completo y borramos los pedazos que sobran para el server
        data.email = `${data.emailUser}@${data.emailDomain}${data.emailTld}`;
        delete data.emailUser;
        delete data.emailDomain;
        delete data.emailTld;
        
        return data;
    }
};

// lo mandamos a window para que main.js lo vea sin drama
window.formHandlers = formHandlers;
