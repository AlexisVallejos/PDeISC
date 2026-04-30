// Utilidad para renderizar visualmente el array
function renderArray(elementId, array) {
    const el = document.getElementById(elementId);
    
    // Animar la actualización
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 300);
    
    // Formatear array como string para mostrarlo
    if (array.length === 0) {
        el.textContent = '[]';
        return;
    }
    
    const isStringArray = typeof array[0] === 'string';
    if (isStringArray) {
        const formatted = array.map(item => `"${item}"`).join(', ');
        el.textContent = `[${formatted}]`;
    } else {
        el.textContent = `[${array.join(', ')}]`;
    }
}

function showMessage(elementId, text, type) {
    const el = document.getElementById(elementId);
    el.textContent = text;
    el.className = `message show ${type}`;
    setTimeout(() => {
        el.classList.remove('show');
    }, 3000);
}

// --- EJERCICIO 1: FRUTAS ---
// Crea un array vacío y agrega tres frutas usando push().
let frutas = [];
let frutasAgregadas = 0;

const frutaInput = document.getElementById('fruta-input');
const frutaBtn = document.getElementById('fruta-btn');

frutaBtn.addEventListener('click', () => {
    const fruta = frutaInput.value.trim();
    
    if (!fruta) {
        showMessage('fruta-msg', 'Ingresa una fruta válida', 'error');
        return;
    }
    
    if (frutasAgregadas < 3) {
        frutas.push(fruta);
        frutasAgregadas++;
        renderArray('frutas-display', frutas);
        frutaInput.value = '';
        
        if (frutasAgregadas === 3) {
            frutaInput.disabled = true;
            frutaBtn.disabled = true;
            showMessage('fruta-msg', '¡Has agregado 3 frutas con éxito!', 'success');
        }
    }
});

frutaInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') frutaBtn.click();
});

// --- EJERCICIO 2: AMIGOS ---
// Agrega los nombres de tus 3 amigos a un array existente llamado amigos.
let amigos = ['Juan'];
let amigosAgregados = 0;

const amigoInput = document.getElementById('amigo-input');
const amigoBtn = document.getElementById('amigo-btn');

amigoBtn.addEventListener('click', () => {
    const amigo = amigoInput.value.trim();
    
    if (!amigo) {
        showMessage('amigo-msg', 'Ingresa un nombre válido', 'error');
        return;
    }
    
    if (amigosAgregados < 3) {
        amigos.push(amigo);
        amigosAgregados++;
        renderArray('amigos-display', amigos);
        amigoInput.value = '';
        
        if (amigosAgregados === 3) {
            amigoInput.disabled = true;
            amigoBtn.disabled = true;
            showMessage('amigo-msg', '¡Tus 3 amigos han sido agregados!', 'success');
        }
    }
});

amigoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') amigoBtn.click();
});

// --- EJERCICIO 3: NÚMEROS ---
// Dado un array de números, agrega un nuevo número solo si es mayor que el último número.
let numeros = [1, 5, 8];

const numeroInput = document.getElementById('numero-input');
const numeroBtn = document.getElementById('numero-btn');

numeroBtn.addEventListener('click', () => {
    const valorStr = numeroInput.value.trim();
    if (!valorStr) {
        showMessage('numero-msg', 'Ingresa un número', 'error');
        return;
    }
    
    const nuevoNumero = Number(valorStr);
    const ultimoNumero = numeros[numeros.length - 1];
    
    if (nuevoNumero > ultimoNumero) {
        numeros.push(nuevoNumero);
        renderArray('numeros-display', numeros);
        numeroInput.value = '';
        showMessage('numero-msg', `¡${nuevoNumero} es mayor a ${ultimoNumero} y fue agregado!`, 'success');
    } else {
        showMessage('numero-msg', `Error: ${nuevoNumero} NO es mayor que el último número (${ultimoNumero})`, 'error');
        // Pequeña animación de error en el input
        numeroInput.style.transform = 'translateX(5px)';
        setTimeout(() => numeroInput.style.transform = 'translateX(-5px)', 100);
        setTimeout(() => numeroInput.style.transform = 'translateX(0)', 200);
    }
});

numeroInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') numeroBtn.click();
});
