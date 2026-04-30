const container = document.getElementById('array-container');
const inputVal = document.getElementById('input-val');
const btnAction = document.getElementById('btn-action');
const errorMsg = document.getElementById('error-msg');
const consoleOutput = document.getElementById('console-output');

if (inputVal) {
    inputVal.style.display = 'none';
}

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
    const frutas = [];
    frutas.push('Manzana');
    frutas.push('Banana');
    frutas.push('Pera');

    const amigos = ['Lucia'];
    amigos.push('Mateo', 'Sofia', 'Tomas');

    const numeros = [8, 15, 22];
    const nuevoNumero = 30;
    if (nuevoNumero > numeros[numeros.length - 1]) {
        numeros.push(nuevoNumero);
    }

    render([
        `Frutas: ${formatArray(frutas)}`,
        `Amigos: ${formatArray(amigos)}`,
        `Numeros: ${formatArray(numeros)}`
    ]);

    showOutput([
        {
            consigna: 'Crea un array vacío y agrega tres frutas usando push().',
            resultado: `frutas = ${formatArray(frutas)}`
        },
        {
            consigna: 'Agrega los nombres de tus 3 amigos a un array existente llamado amigos.',
            resultado: `amigos = ${formatArray(amigos)}`
        },
        {
            consigna: 'Dado un array de números, agrega un nuevo número solo si es mayor que el último número.',
            resultado: `El nuevo numero ${nuevoNumero} es mayor que el ultimo, entonces numeros = ${formatArray(numeros)}`
        }
    ]);
}

btnAction.addEventListener('click', () => {
    runExercises();
});

runExercises();
