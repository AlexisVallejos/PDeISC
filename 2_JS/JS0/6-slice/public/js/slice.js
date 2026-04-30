function showResult(elementId, result) {
    const el = document.getElementById(elementId);
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 300);
    el.textContent = result;
}

document.getElementById('btn-1').addEventListener('click', () => {
    try {
        const execute = () => {
            let numSlice = [10, 20, 30, 40, 50];
let primerosTres = numSlice.slice(0, 3);
return `Copia: [${primerosTres.join(', ')}]`;
        };
        showResult('display-1', execute());
    } catch(e) {
        showResult('display-1', 'Error: ' + e.message);
    }
});

document.getElementById('btn-2').addEventListener('click', () => {
    try {
        const execute = () => {
            let peliculas = ['Peli1', 'Peli2', 'Peli3', 'Peli4', 'Peli5'];
let copiaParcial = peliculas.slice(2, 4);
return `Copia (2 a 4): [${copiaParcial.join(', ')}]`;
        };
        showResult('display-2', execute());
    } catch(e) {
        showResult('display-2', 'Error: ' + e.message);
    }
});

document.getElementById('btn-3').addEventListener('click', () => {
    try {
        const execute = () => {
            let numSlice2 = [10, 20, 30, 40, 50];
let ultimos = numSlice2.slice(-3);
return `Últimos 3: [${ultimos.join(', ')}]`;
        };
        showResult('display-3', execute());
    } catch(e) {
        showResult('display-3', 'Error: ' + e.message);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    showResult('display-1', 'Interacción lista: usa clic o teclas 1, 2 y 3.');
});

document.addEventListener('keydown', (event) => {
    if (event.key === '1') document.getElementById('btn-1').click();
    if (event.key === '2') document.getElementById('btn-2').click();
    if (event.key === '3') document.getElementById('btn-3').click();
});
