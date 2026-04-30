/**
 * Método: shift()
 * 
 * Explicación Humana: Es como cuando la cajera atiende a la primera persona de la fila. 
 * Esa persona se va, y el que estaba segundo pasa a ser el primero.
 * 
 * Explicación Técnica: El método shift() muta el array original eliminando el elemento 
 * en el índice 0. Los demás elementos bajan un índice. Retorna el elemento eliminado.
 */

// Ejemplo 1: Eliminar el primer elemento
let enteros = [10, 20, 30, 40];
// Se elimina el 10, y el 20 pasa a ser el índice 0
enteros.shift();
console.log("1. Array de enteros:", enteros); // Resultado: [20, 30, 40]

// Ejemplo 2: Leer y eliminar un mensaje (como en una bandeja de entrada)
let chat = ["Hola!", "¿Cómo estás?", "Todo bien"];
// Extraemos el primer mensaje para leerlo, quitándolo de la lista
let primerMensaje = chat.shift();
console.log("2. Mensajes restantes:", chat); // Resultado: ["¿Cómo estás?", "Todo bien"]
console.log("   Mensaje extraído:", primerMensaje); // Resultado: "Hola!"

// Ejemplo 3: Simulación de una cola FIFO (First In, First Out / Primero en entrar, primero en salir)
let colaClientes = ["Cliente 1", "Cliente 2", "Cliente 3"];
// Atendemos al primero de la cola
let clienteAtendido = colaClientes.shift();
console.log("3. Cola restante:", colaClientes); // Resultado: ["Cliente 2", "Cliente 3"]
console.log("   Atendiendo a:", clienteAtendido); // Resultado: "Cliente 1"
