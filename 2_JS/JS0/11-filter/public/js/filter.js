let numeros = [4, 11, 20, 7, 15];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="text" id="input-numeros" placeholder="Numeros: 4, 11, 20" value="4, 11, 20, 7, 15">
    <input type="number" id="input-minimo" placeholder="Mayor que" value="10">
    <button id="btn-filter">Filtrar</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputNumeros = document.getElementById('input-numeros');
const inputMinimo = document.getElementById('input-minimo');
const btnFilter = document.getElementById('btn-filter');
const btnReset = document.getElementById('btn-reset');

function parseNumbers(value) {
    return value
        .split(',')
        .map(item => Number(item.trim()))
        .filter(numero => Number.isFinite(numero));
}

function render(items = numeros) {
    container.innerHTML = '';

    if (items.length === 0) {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = 'Sin resultados';
        container.appendChild(div);
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = item;
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

btnFilter.addEventListener('click', () => {
    const valores = parseNumbers(inputNumeros.value);
    const minimo = Number(inputMinimo.value);

    if (valores.length === 0) {
        showError('Escribi numeros separados por coma.');
        return;
    }

    if (!Number.isFinite(minimo)) {
        showError('Escribi un minimo valido.');
        return;
    }

    clearError();
    numeros = valores;
    const filtrados = numeros.filter(numero => numero > minimo);
    render(filtrados);
    setOutput(`filter() dejo los valores mayores que ${minimo}: [${filtrados.join(', ')}].`);
});

btnReset.addEventListener('click', () => {
    numeros = [4, 11, 20, 7, 15];
    inputNumeros.value = '4, 11, 20, 7, 15';
    inputMinimo.value = '10';
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Edita los numeros y elegi el minimo para filtrar.');
