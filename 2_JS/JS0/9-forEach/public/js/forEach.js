function showResult(elementId, result) {
    const el = document.getElementById(elementId);
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 300);
    el.textContent = result;
}

document.getElementById('btn-1').addEventListener('click', () => {
    try {
        const execute = () => {
            let personas = ['Ana', 'Juan', 'Maria'];
let saludos = [];
personas.forEach(p => saludos.push(`Hola ${p}`));
return saludos.join(', ');
        };
        showResult('display-1', execute());
    } catch(e) {
        showResult('display-1', 'Error: ' + e.message);
    }
});

document.getElementById('btn-2').addEventListener('click', () => {
    try {
        const execute = () => {
            let valores = [2, 4, 6];
let dobles = [];
valores.forEach(v => dobles.push(v * 2));
return `Dobles: [${dobles.join(', ')}]`;
        };
        showResult('display-2', execute());
    } catch(e) {
        showResult('display-2', 'Error: ' + e.message);
    }
});

document.getElementById('btn-3').addEventListener('click', () => {
    try {
        const execute = () => {
            let users = [{nombre: 'Luis', edad: 25}, {nombre: 'Marta', edad: 30}];
let res = [];
users.forEach(u => res.push(`${u.nombre} (${u.edad} años)`));
return res.join(' | ');
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
