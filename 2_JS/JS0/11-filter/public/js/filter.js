/**
 * Método: filter()
 * 
 * Explicación Humana: Es como un colador de fideos. Pasas toda la lista por el colador, 
 * los elementos que cumplen la regla (como ser más grandes que un agujero) pasan al nuevo grupo, 
 * los que no, se quedan afuera.
 * 
 * Explicación Técnica: Crea y retorna un NUEVO array con todos los elementos que cumplan 
 * la condición implementada por la función dada. Si la función retorna 'true', el elemento 
 * se incluye; si retorna 'false', se excluye. NO muta el array original.
 */

// Ejemplo 1: Filtrar números por una condición matemática
let numeros = [5, 12, 8, 20, 3];
// Solo pasan al nuevo array los números que son mayores estrictamente a 10
let mayoresA10 = numeros.filter(num => num > 10);
console.log("1. Lista original:", numeros);
console.log("   Números mayores a 10:", mayoresA10); // Resultado: [12, 20]

// Ejemplo 2: Filtrar strings por su longitud
let palabras = ["sol", "murcielago", "luna", "estrellas"];
// Evaluamos la propiedad 'length' de cada string
let masDe5Letras = palabras.filter(palabra => palabra.length > 5);
console.log("2. Palabras largas (más de 5 letras):", masDe5Letras); // Resultado: ["murcielago", "estrellas"]

// Ejemplo 3: Filtrar una lista de objetos por una propiedad booleana
let usuarios = [
    { nombre: "Ana", activo: true },
    { nombre: "Luis", activo: false },
    { nombre: "Carlos", activo: true }
];
// Nos quedamos solo con los objetos cuya propiedad 'activo' sea true
let usuariosActivos = usuarios.filter(usuario => usuario.activo === true);
console.log("3. Usuarios activos en el sistema:", usuariosActivos);
