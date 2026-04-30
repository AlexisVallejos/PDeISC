/**
 * Método: slice()
 * 
 * Explicación Humana: Es como sacar una foto o fotocopiar una parte de una lista. 
 * Obtienes una copia de los elementos que pediste, pero la lista original queda exactamente igual.
 * 
 * Explicación Técnica: El método slice() NO muta el array original. Retorna una copia 
 * superficial (shallow copy) de una porción del array dentro de un nuevo array, 
 * determinado por el índice de inicio y fin (el fin no se incluye).
 * Sintaxis: array.slice(indiceInicio, indiceFin)
 */

// Ejemplo 1: Copiar los primeros elementos
let numeros = [10, 20, 30, 40, 50];
// Copiamos desde el índice 0 hasta el 3 (sin incluir el índice 3)
let primerosTres = numeros.slice(0, 3);
console.log("1. Primeros tres:", primerosTres); // Resultado: [10, 20, 30]

// Ejemplo 2: Copiar una sección intermedia
let peliculas = ["Matrix", "Avatar", "Inception", "Titanic", "Gladiador"];
// Copiamos desde el índice 2 ("Inception") hasta el 4 ("Titanic") (el 4 no se incluye)
let copiaParcial = peliculas.slice(2, 4); 
console.log("2. Copia parcial:", copiaParcial); // Resultado: ["Inception", "Titanic"]

// Ejemplo 3: Usar índices negativos para copiar desde el final
let frutas = ["Manzana", "Naranja", "Banana", "Pera", "Uva"];
// Un índice negativo indica cuántos elementos desde el final queremos tomar
let ultimasTres = frutas.slice(-3);
console.log("3. Últimas tres:", ultimasTres); // Resultado: ["Banana", "Pera", "Uva"]
console.log("   Array original intacto:", frutas); // Demostración de que no muta
