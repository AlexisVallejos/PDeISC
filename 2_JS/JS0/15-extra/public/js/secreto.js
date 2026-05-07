const inputMensaje = document.getElementById('input-mensaje');
const btnDecodificar = document.getElementById('btn-decodificar');
const btnEjemplo = document.getElementById('btn-ejemplo');
const btnLimpiar = document.getElementById('btn-limpiar');
const errorMsg = document.getElementById('error-msg');
const container = document.getElementById('array-container');
const consoleOutput = document.getElementById('console-output');

const ejemplo = 'Hoy (.sh 22 sal a) (ed asac ne sominuer son) Marcelo.';

function reverseText(text) {
    return Array.from(text).reverse().join('');
}

function decodeSecretMessage(message) {
    let result = '';
    let fragment = '';
    let insideParentheses = false;

    for (const character of message) {
        if (character === '(') {
            if (insideParentheses) {
                throw new Error('No se permiten parentesis anidados.');
            }

            insideParentheses = true;
            fragment = '';
            continue;
        }

        if (character === ')') {
            if (!insideParentheses) {
                throw new Error('Hay un parentesis de cierre sin apertura.');
            }

            result += reverseText(fragment);
            insideParentheses = false;
            fragment = '';
            continue;
        }

        if (insideParentheses) {
            fragment += character;
        } else {
            result += character;
        }
    }

    if (insideParentheses) {
        throw new Error('Hay un parentesis abierto sin cerrar.');
    }

    return result;
}

function renderResult(message) {
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'array-item message-item';
    div.textContent = message || 'Sin resultado';
    container.appendChild(div);
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
}

function clearError() {
    errorMsg.textContent = '';
    errorMsg.classList.remove('show');
}

function setOutput(message) {
    consoleOutput.textContent = message;
}

btnDecodificar.addEventListener('click', () => {
    const message = inputMensaje.value.trim();

    if (!message) {
        showError('Ingresa un mensaje para decodificar.');
        return;
    }

    try {
        const decoded = decodeSecretMessage(message);
        clearError();
        renderResult(decoded);
        setOutput(`Se decodificaron ${message.length} caracteres.`);
    } catch (error) {
        showError(error.message);
    }
});

btnEjemplo.addEventListener('click', () => {
    inputMensaje.value = ejemplo;
    clearError();
    renderResult('Ejemplo cargado. Presiona Decodificar.');
    setOutput('Mensaje de ejemplo listo.');
});

btnLimpiar.addEventListener('click', () => {
    inputMensaje.value = '';
    clearError();
    renderResult('Esperando mensaje...');
    setOutput('El resultado aparecera aca.');
});

inputMensaje.value = ejemplo;
renderResult('Presiona Decodificar para resolver el ejemplo.');
