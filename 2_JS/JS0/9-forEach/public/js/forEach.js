const container = document.getElementById('array-container');
const btnAction = document.getElementById('btn-action');
const consoleOutput = document.getElementById('console-output');

btnAction.textContent = 'Mostrar consignas resueltas';

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
    const nombres = ['Ana', 'Luis', 'Sofia'];
    const saludos = [];
    nombres.forEach(nombre => {
        saludos.push(`Hola, ${nombre}`);
    });

    const numeros = [2, 4, 6];
    const dobles = [];
    numeros.forEach(numero => {
        dobles.push(numero * 2);
    });

    const personas = [
        { nombre: 'Carla', edad: 21 },
        { nombre: 'Diego', edad: 24 },
        { nombre: 'Mia', edad: 19 }
    ];
    const datosPersonas = [];
    personas.forEach(persona => {
        datosPersonas.push(`${persona.nombre} tiene ${persona.edad} años`);
    });

    render([
        ...saludos,
        `Dobles: ${dobles.join(', ')}`,
        ...datosPersonas
    ]);

    showOutput([
        {
            consigna: 'Muestra todos los nombres de un array con un saludo.',
            resultado: saludos.join(' | ')
        },
        {
            consigna: 'Imprime el doble de cada número de un array con forEach()',
            resultado: `Dobles: ${dobles.join(', ')}`
        },
        {
            consigna: 'Dado un array de objetos {nombre, edad}, muestra cada nombre con su edad.',
            resultado: datosPersonas.join(' | ')
        }
    ]);
}

btnAction.addEventListener('click', () => {
    runExercises();
});

runExercises();
