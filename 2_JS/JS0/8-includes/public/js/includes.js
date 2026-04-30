function showResult(elementId, result) {
    const el = document.getElementById(elementId);
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 300);
    el.textContent = result;
}

document.getElementById('btn-1').addEventListener('click', () => {
    try {
        const execute = () => {
            let roles = ['user', 'editor', 'admin'];
return `Contiene admin: ${roles.includes('admin')}`;
        };
        showResult('display-1', execute());
    } catch(e) {
        showResult('display-1', 'Error: ' + e.message);
    }
});

document.getElementById('btn-2').addEventListener('click', () => {
    try {
        const execute = () => {
            let arrayColores = ['rojo', 'azul', 'amarillo'];
return `Contiene verde: ${arrayColores.includes('verde')}`;
        };
        showResult('display-2', execute());
    } catch(e) {
        showResult('display-2', 'Error: ' + e.message);
    }
});

document.getElementById('btn-3').addEventListener('click', () => {
    try {
        const execute = () => {
            let arrayNumeros = [1, 2, 3];
let num = 4;
if (!arrayNumeros.includes(num)) arrayNumeros.push(num);
return `Array final: [${arrayNumeros.join(', ')}]`;
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
