/**
 * Método: forEach()
 * 
 * Explicación Humana: Es como pasar lista en clase. Agarras cada elemento del array, 
 * uno por uno, y haces una acción con él. No te devuelve una nueva lista, solo ejecuta algo por cada uno.
 * 
 * Explicación Técnica: Ejecuta la función proporcionada una vez por cada elemento del array. 
 * NO muta el array (aunque la función callback podría hacerlo). Siempre retorna undefined, 
 * por lo que no sirve para asignar su resultado a una variable.
 */

// Ejemplo 1: Ejecutar una acción para cada string
let personas = ["Lucas", "Marta", "Julia"];
console.log("1. Saludos:");
// Por cada "persona" en el array "personas", ejecuta este bloque
personas.forEach(persona => {
    console.log("   Hola " + persona + "!");
});

// Ejemplo 2: Realizar operaciones matemáticas e imprimirlas
let valores = [2, 4, 6, 8];
console.log("2. Dobles calculados:");
// Calcula e imprime, pero no guarda los resultados
valores.forEach(valor => {
    console.log("   ", valor * 2);
});

// Ejemplo 3: Iterar sobre un array de objetos (muy común)
let usuarios = [
    { nombre: "Ana", edad: 25 },
    { nombre: "Pedro", edad: 30 },
    { nombre: "Luis", edad: 22 }
];
console.log("3. Detalle de usuarios:");
// Accedemos a las propiedades nombre y edad de cada objeto iterado
usuarios.forEach(usuario => {
    console.log("   El usuario " + usuario.nombre + " tiene " + usuario.edad + " años.");
});
