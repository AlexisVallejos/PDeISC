let cola = ['Cliente 1', 'Cliente 2', 'Cliente 3'];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="text" id="input-cliente" placeholder="Nuevo cliente">
    <button id="btn-agregar">Agregar a la cola</button>
    <button id="btn-shift">Atender primero</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputCliente = document.getElementById('input-cliente');
const btnAgregar = document.getElementById('btn-agregar');
const btnShift = document.getElementById('btn-shift');
const btnReset = document.getElementById('btn-reset');

function render() {
    container.innerHTML = '';

    if (cola.length === 0) {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = 'Cola vacia';
        container.appendChild(div);
        return;
    }

    cola.forEach(cliente => {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = cliente;
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

btnAgregar.addEventListener('click', () => {
    const cliente = inputCliente.value.trim();

    if (!cliente) {
        showError('Escribi un cliente para sumarlo a la cola.');
        return;
    }

    clearError();
    cola.push(cliente);
    inputCliente.value = '';
    render();
    setOutput(`"${cliente}" entro al final de la cola.`);
});

inputCliente.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        btnAgregar.click();
    }
});

btnShift.addEventListener('click', () => {
    if (cola.length === 0) {
        showError('La cola esta vacia.');
        return;
    }

    clearError();
    const atendido = cola.shift();
    render();
    setOutput(`shift() atendio a "${atendido}" y lo quito del inicio.`);
});

btnReset.addEventListener('click', () => {
    cola = ['Cliente 1', 'Cliente 2', 'Cliente 3'];
    clearError();
    render();
    setOutput('Cola reiniciada.');
});

render();
setOutput('Agrega clientes o atende al primero con shift().');
