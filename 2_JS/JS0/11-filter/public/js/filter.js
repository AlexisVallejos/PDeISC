function showResult(elementId, result) {
    const el = document.getElementById(elementId);
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 300);
    el.textContent = result;
}

document.getElementById('btn-1').addEventListener('click', () => {
    try {
        const execute = () => {
            let nums = [5, 12, 8, 20, 3];
let res = nums.filter(n => n > 10);
return `Mayores a 10: [${res.join(', ')}]`;
        };
        showResult('display-1', execute());
    } catch(e) {
        showResult('display-1', 'Error: ' + e.message);
    }
});

document.getElementById('btn-2').addEventListener('click', () => {
    try {
        const execute = () => {
            let palabras = ['sol', 'planeta', 'luz', 'galaxia'];
let res = palabras.filter(p => p.length > 5);
return `Palabras largas: [${res.join(', ')}]`;
        };
        showResult('display-2', execute());
    } catch(e) {
        showResult('display-2', 'Error: ' + e.message);
    }
});

document.getElementById('btn-3').addEventListener('click', () => {
    try {
        const execute = () => {
            let usrs = [{n: 'A', activo: true}, {n: 'B', activo: false}];
let res = usrs.filter(u => u.activo).map(u => u.n);
return `Activos: [${res.join(', ')}]`;
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
