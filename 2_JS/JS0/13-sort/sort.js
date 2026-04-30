/**
 * Método: sort()
 * 
 * Explicación Humana: Es un organizador. Toma una lista desordenada y la ordena. Pero cuidado: 
 * por defecto ordena todo como si fueran palabras (alfabéticamente), así que si ordenas números, 
 * el 10 vendrá antes que el 2, porque "1" va antes que "2".
 * 
 * Explicación Técnica: Ordena los elementos del array localmente y devuelve el array ordenado. 
 * MUTA el array original. Por defecto, los elementos se convierten en strings y se ordenan 
 * según sus valores Unicode. Para ordenar números correctamente, hay que pasar una función de comparación.
 */

// Ejemplo 1: Ordenar números (requiere función de comparación)
let numeros = [40, 100, 1, 5, 25, 10];
// Función de comparación para ordenar de menor a mayor.
// Si (a - b) es negativo, 'a' va primero. Si es positivo, 'b' va primero.
numeros.sort((a, b) => a - b);
console.log("1. Números ordenados matemáticamente:", numeros); 
// Resultado: [1, 5, 10, 25, 40, 100]

// Ejemplo 2: Ordenar strings alfabéticamente
let palabras = ["Zanahoria", "Manzana", "Banana", "Kiwi"];
// Para texto, el comportamiento por defecto es el correcto
palabras.sort();
console.log("2. Palabras ordenadas de la A a la Z:", palabras); 
// Resultado: ["Banana", "Kiwi", "Manzana", "Zanahoria"]

// Ejemplo 3: Ordenar un array de objetos por una de sus propiedades
let personas = [
    { nombre: "Ana", edad: 30 },
    { nombre: "Luis", edad: 22 },
    { nombre: "Carlos", edad: 28 }
];
// Comparamos numéricamente la propiedad 'edad' de cada objeto
personas.sort((a, b) => a.edad - b.edad);
console.log("3. Objetos ordenados desde el más joven al mayor:");
console.log(personas);
