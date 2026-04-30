/**
 * Método: reverse()
 * 
 * Explicación Humana: Es como darle la vuelta a una fila. El último pasa a ser el primero, 
 * y el primero pasa a ser el último. 
 * 
 * Explicación Técnica: Invierte el orden de los elementos de un array en su lugar. 
 * El primer elemento pasa a ser el último y el último pasa a ser el primero. 
 * MUTA el array original, y retorna una referencia al mismo array invertido.
 */

// Ejemplo 1: Invertir orden de caracteres en un array
let letras = ["A", "B", "C", "D"];
// Cambia directamente la posición de los elementos
letras.reverse();
console.log("1. Letras en orden inverso:", letras); // Resultado: ["D", "C", "B", "A"]

// Ejemplo 2: Invertir una secuencia numérica
let numeros = [1, 2, 3, 4, 5];
numeros.reverse();
console.log("2. Cuenta regresiva:", numeros); // Resultado: [5, 4, 3, 2, 1]

// Ejemplo 3: Uso combinado para dar vuelta un String
let texto = "Hola Mundo";
// Los strings no tienen reverse(), así que:
// 1. split(""): convierte el string en un array de letras ["H","o","l","a", ...]
// 2. reverse(): da vuelta ese array de letras
// 3. join(""): vuelve a unir el array modificado en un solo string
let textoInvertido = texto.split("").reverse().join("");
console.log("3. Texto original:", texto);
console.log("   Texto invertido:", textoInvertido); // Resultado: "odnuM aloH"
