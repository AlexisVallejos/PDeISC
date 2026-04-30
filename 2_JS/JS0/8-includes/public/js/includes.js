let usuarios = ['admin', 'editor', 'invitado'];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="text" id="input-usuario" placeholder="Usuario o rol">
    <button id="btn-comprobar">Comprobar includes()</button>
    <button id="btn-agregar">Agregar si no existe</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputUsuario = document.getElementById('input-usuario');
const btnComprobar = document.getElementById('btn-comprobar');
const btnAgregar = document.getElementById('btn-agregar');
const btnReset = document.getElementById('btn-reset');

function render() {
    container.innerHTML = '';
    usuarios.forEach(usuario => {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = usuario;
        container.appendChild(div);
    });
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
}

function clearError() {
    errorMsg.textContent = '';
    errorMsg.classList.remove('show');
}

function setOutput(message) {
    consoleOutput.textContent = message;
}

btnComprobar.addEventListener('click', () => {
    const usuario = inputUsuario.value.trim();

    if (!usuario) {
        showError('Escribi un valor para comprobarlo.');
        return;
    }

    clearError();
    const existe = usuarios.includes(usuario);
    setOutput(`includes("${usuario}") devolvio ${existe}.`);
});

btnAgregar.addEventListener('click', () => {
    const usuario = inputUsuario.value.trim();

    if (!usuario) {
        showError('Escribi un valor para agregarlo.');
        return;
    }

    clearError();
    if (usuarios.includes(usuario)) {
        setOutput(`"${usuario}" ya estaba en el array, no se agrego otra vez.`);
        return;
    }

    usuarios.push(usuario);
    inputUsuario.value = '';
    render();
    setOutput(`"${usuario}" no estaba presente y se agrego al array.`);
});

inputUsuario.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        btnComprobar.click();
    }
});

btnReset.addEventListener('click', () => {
    usuarios = ['admin', 'editor', 'invitado'];
    inputUsuario.value = '';
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Escribi un valor para comprobar si existe en el array.');
