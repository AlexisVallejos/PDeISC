let animales = ['Perro', 'Gato', 'Conejo'];

const controls = document.getElementById('controls');
const container = document.getElementById('array-container');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

controls.innerHTML = `
    <input type="text" id="input-animal" placeholder="Agregar animal">
    <button id="btn-agregar">Agregar</button>
    <button id="btn-pop">Quitar ultimo con pop()</button>
    <button id="btn-reset">Reiniciar</button>
`;

const inputAnimal = document.getElementById('input-animal');
const btnAgregar = document.getElementById('btn-agregar');
const btnPop = document.getElementById('btn-pop');
const btnReset = document.getElementById('btn-reset');

function render() {
    container.innerHTML = '';

    if (animales.length === 0) {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = 'Array vacio';
        container.appendChild(div);
        return;
    }

    animales.forEach(animal => {
        const div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = animal;
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
    const animal = inputAnimal.value.trim();

    if (!animal) {
        showError('Escribi un animal para cargarlo.');
        return;
    }

    clearError();
    animales.push(animal);
    inputAnimal.value = '';
    render();
    setOutput(`Se agrego "${animal}" para que puedas seguir probando pop().`);
});

inputAnimal.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        btnAgregar.click();
    }
});

btnPop.addEventListener('click', () => {
    if (animales.length === 0) {
        showError('No quedan animales para quitar.');
        return;
    }

    clearError();
    const eliminado = animales.pop();
    render();
    setOutput(`pop() quito "${eliminado}".`);
});

btnReset.addEventListener('click', () => {
    animales = ['Perro', 'Gato', 'Conejo'];
    clearError();
    render();
    setOutput('Array reiniciado.');
});

render();
setOutput('Agrega animales o quita el ultimo con pop().');
