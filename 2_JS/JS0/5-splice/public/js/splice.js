const container = document.getElementById('array-container');
const btnAction = document.getElementById('btn-action');
const consoleOutput = document.getElementById('console-output');

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
    const letras = ['A', 'B', 'C', 'D', 'E'];
    const letrasEliminadas = letras.splice(1, 2);

    const nombres = ['Ana', 'Luis', 'Marta'];
    nombres.splice(1, 0, 'Carlos');

    const numeros = [10, 20, 30, 40, 50];
    const reemplazados = numeros.splice(2, 2, 35, 45);

    render([
        `Letras: ${formatArray(letras)}`,
        `Nombres: ${formatArray(nombres)}`,
        `Numeros: ${formatArray(numeros)}`
    ]);

    showOutput([
        {
            consigna: 'Elimina dos elementos desde la posición 1 de un array de letras.',
            resultado: `Eliminados: ${formatArray(letrasEliminadas)}; letras = ${formatArray(letras)}`
        },
        {
            consigna: 'Inserta un nuevo nombre en la segunda posición sin eliminar nada.',
            resultado: `nombres = ${formatArray(nombres)}`
        },
        {
            consigna: 'Reemplaza dos elementos por otros nuevos desde una posición determinada.',
            resultado: `Reemplazados: ${formatArray(reemplazados)}; numeros = ${formatArray(numeros)}`
        }
    ]);
}

btnAction.addEventListener('click', () => {
    runExercises();
});

runExercises();
