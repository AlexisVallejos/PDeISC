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
    const numeros = [2, 4, 6];
    const porTres = numeros.map(numero => numero * 3);

    const nombres = ['ana', 'luis', 'sofia'];
    const nombresMayusculas = nombres.map(nombre => nombre.toUpperCase());

    const precios = [100, 250, 500];
    const preciosConIva = precios.map(precio => Number((precio * 1.21).toFixed(2)));

    render([
        `Por 3: ${formatArray(porTres)}`,
        `Mayusculas: ${formatArray(nombresMayusculas)}`,
        `Con IVA: ${formatArray(preciosConIva)}`
    ]);

    showOutput([
        {
            consigna: 'Crea un nuevo array con cada número multiplicado por 3.',
            resultado: `porTres = ${formatArray(porTres)}`
        },
        {
            consigna: 'Convierte un array de nombres en mayúsculas.',
            resultado: `nombresMayusculas = ${formatArray(nombresMayusculas)}`
        },
        {
            consigna: 'A un array de precios, agrégale el 21% de IVA y crea un nuevo array.',
            resultado: `preciosConIva = ${formatArray(preciosConIva)}`
        }
    ]);
}

btnAction.addEventListener('click', () => {
    runExercises();
});

runExercises();
