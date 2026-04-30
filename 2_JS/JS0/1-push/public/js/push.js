/**
 * Método: push()
 * 
 * Explicación Humana: Imagina una fila en el supermercado. push() es como cuando una persona 
 * se suma al final de la fila. Agrega uno o más elementos al final de un arreglo.
 * 
 * Explicación Técnica: El método push() muta (modifica) el array original añadiendo uno o más elementos 
 * en la última posición y retorna la nueva longitud (length) del array.
 */

// Ejemplo 1: Agregar elementos a un array vacío
let frutas = [];
// Agregamos tres elementos al final del array
frutas.push("Manzana", "Banana", "Pera");
console.log("1. Array de frutas:", frutas); // Resultado: ["Manzana", "Banana", "Pera"]

// Ejemplo 2: Agregar elementos a un array existente
let amigos = ["Juan"];
// Podemos agregar múltiples elementos en una sola llamada a push()
amigos.push("Pedro", "Maria", "Ana");
console.log("2. Array de amigos:", amigos); // Resultado: ["Juan", "Pedro", "Maria", "Ana"]

// Ejemplo 3: Agregar condicionalmente
let numeros = [5, 10, 15];
let nuevoNumero = 20;
// Verificamos si el nuevo número es mayor que el último número del array
// numeros[numeros.length - 1] accede al último elemento
if (nuevoNumero > numeros[numeros.length - 1]) {
    numeros.push(nuevoNumero);
}
console.log("3. Array de números:", numeros); // Resultado: [5, 10, 15, 20]
