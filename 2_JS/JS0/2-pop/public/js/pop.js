const container = document.getElementById('array-container');
const btnAction = document.getElementById('btn-action');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

if (errorMsg) {
    errorMsg.textContent = '';
    errorMsg.classList.remove('show');
}

btnAction.textContent = 'Mostrar consignas resueltas';

function formatArray(array) {
    return `[${array.map(item => String(item)).join(', ')}]`;
}

function render(items) {
    container.innerHTML = '';
    items.forEach(item => {
        let div = document.createElement('div');
        div.className = 'array-item';
        div.textContent = item;
        container.appendChild(div);
    });
}

function showOutput(exercises) {
    consoleOutput.innerHTML = exercises.map((exercise, index) => (
        `<p><strong>${index + 1}. ${exercise.consigna}</strong><br>${exercise.resultado}</p>`
    )).join('');
}

function runExercises() {
    const animales = ['Perro', 'Gato', 'Conejo'];
    const animalEliminado = animales.pop();

    const compras = ['Pan', 'Leche', 'Huevos'];
    const productoEliminado = compras.pop();

    const elementos = ['A', 'B', 'C'];
    const eliminados = [];
    while (elementos.length > 0) {
        eliminados.push(elementos.pop());
    }

    render([
        `Animales: ${formatArray(animales)}`,
        `Compras: ${formatArray(compras)}`,
        `Array vaciado: ${formatArray(elementos)}`
    ]);

    showOutput([
        {
            consigna: 'Elimina el último elemento de un array de animales.',
            resultado: `Se elimino ${animalEliminado}; animales = ${formatArray(animales)}`
        },
        {
            consigna: 'Quita el último producto de una lista de compras y muestra cuál fue eliminado.',
            resultado: `Producto eliminado: ${productoEliminado}; compras = ${formatArray(compras)}`
        },
        {
            consigna: 'Usa un bucle while para vaciar un array con pop().',
            resultado: `Elementos quitados con pop(): ${formatArray(eliminados)}; array final = ${formatArray(elementos)}`
        }
    ]);
}

btnAction.addEventListener('click', () => {
    runExercises();
});

runExercises();
