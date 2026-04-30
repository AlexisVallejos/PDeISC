/**
 * Método: map()
 * 
 * Explicación Humana: Es como una máquina transformadora. Entra una lista de manzanas, 
 * la máquina hace su trabajo, y sale una nueva lista del mismo tamaño pero con jugo de manzana.
 * 
 * Explicación Técnica: Crea y retorna un NUEVO array con los resultados de la llamada a la 
 * función indicada aplicados a cada uno de sus elementos. NO muta el array original. 
 * A diferencia de forEach, map() está diseñado específicamente para transformar datos.
 */

// Ejemplo 1: Transformación matemática simple
let numeros = [1, 2, 3, 4];
// Tomamos cada número y lo multiplicamos por 3. El resultado forma el nuevo array.
let multiplicados = numeros.map(num => num * 3);
console.log("1. Números originales:", numeros);
console.log("   Multiplicados por 3:", multiplicados); // Resultado: [3, 6, 9, 12]

// Ejemplo 2: Transformación de texto
let nombres = ["juan", "maria", "pedro"];
// Convertimos cada nombre a mayúsculas
let nombresMayusculas = nombres.map(nombre => nombre.toUpperCase());
console.log("2. Nombres en mayúsculas:", nombresMayusculas);

// Ejemplo 3: Aplicar lógica de negocio (calcular impuestos)
let precios = [100, 200, 300];
// A cada precio le sumamos el 21% de IVA (multiplicando por 1.21)
let preciosConIva = precios.map(precio => precio * 1.21);
console.log("3. Precios originales:", precios);
console.log("   Precios con 21% IVA:", preciosConIva);
