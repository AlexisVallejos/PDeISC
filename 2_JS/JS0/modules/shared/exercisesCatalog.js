const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

function splitCsv(text) {
  return String(text || "").split(",").map((x) => x.trim()).filter(Boolean);
}

function parseNumberCsv(text) {
  const arr = splitCsv(text);
  if (!arr.length) return { ok: false, error: "Ingresa al menos un numero." };
  const nums = arr.map((n) => Number(n));
  if (nums.some((n) => Number.isNaN(n))) return { ok: false, error: "Solo numeros separados por coma." };
  return { ok: true, value: nums };
}

function parseTextCsv(text, label) {
  const arr = splitCsv(text);
  if (!arr.length) return { ok: false, error: `Ingresa al menos un valor para ${label}.` };
  if (arr.some((x) => !onlyLetters.test(x))) return { ok: false, error: `${label}: solo letras y espacios.` };
  return { ok: true, value: arr };
}

function parseNameAge(text) {
  const arr = splitCsv(text).map((it) => it.split(":").map((x) => x.trim()));
  if (!arr.length) return { ok: false, error: "Ingresa al menos una persona. Formato nombre:edad" };
  const out = [];
  for (const [nombre, edad] of arr) {
    if (!nombre || !onlyLetters.test(nombre)) return { ok: false, error: "Nombre invalido en objetos nombre:edad." };
    const n = Number(edad);
    if (Number.isNaN(n)) return { ok: false, error: "Edad invalida en objetos nombre:edad." };
    out.push({ nombre, edad: n });
  }
  return { ok: true, value: out };
}

function parseNameActive(text) {
  const arr = splitCsv(text).map((it) => it.split(":").map((x) => x.trim()));
  if (!arr.length) return { ok: false, error: "Ingresa al menos un usuario. Formato nombre:true|false" };
  const out = [];
  for (const [nombre, activo] of arr) {
    if (!nombre || !onlyLetters.test(nombre)) return { ok: false, error: "Nombre invalido en usuarios." };
    if (!["true", "false"].includes(String(activo).toLowerCase())) return { ok: false, error: "Activo debe ser true o false." };
    out.push({ nombre, activo: String(activo).toLowerCase() === "true" });
  }
  return { ok: true, value: out };
}

function parsePriceObjects(text) {
  const nums = parseNumberCsv(text);
  if (!nums.ok) return nums;
  return { ok: true, value: nums.value.map((precio) => ({ precio })) };
}

export function validarParentesisBalanceados(texto) {
  let balance = 0;
  for (const ch of texto) {
    if (ch === "(") balance += 1;
    if (ch === ")") balance -= 1;
    if (balance < 0) return false;
  }
  return balance === 0;
}

export function decodificarSecreto(texto) {
  return texto.replace(/\(([^()]*)\)/g, (_, b) => b.split("").reverse().join(""))
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function cifrarSecreto(texto) {
  const limpio = String(texto || "").trim().replace(/\s+/g, " ");
  if (!limpio) return "";
  return `(${limpio.split("").reverse().join("")})`;
}

export function pasosSecreto(texto) {
  const pasos = [];
  texto.replace(/\(([^()]*)\)/g, (_, b) => {
    pasos.push({ fragmentoOriginal: b, fragmentoInvertido: b.split("").reverse().join("") });
    return b;
  });
  return pasos;
}

const defs = {
  push: { categoria: "mutador", variantes: [
    { nombre: "Frutas con push", consigna: "Crea un array vacio y agrega tres frutas usando push().", campos: [{ key: "frutas", label: "Tres frutas (coma)", tipo: "textCsv" }], operacion: "arr.push(fruta1, fruta2, fruta3)", codigo: "const arr = []; arr.push('manzana', 'banana', 'naranja');", run: ({ frutas }) => { const arr=[]; arr.push(...frutas.slice(0,3)); return arr; } },
    { nombre: "Amigos con push", consigna: "Agrega los nombres de tus 3 amigos a un array llamado amigos.", campos: [{ key: "base", label: "Amigos actuales (coma)", tipo: "textCsv" }, { key: "nuevos", label: "Tres amigos nuevos (coma)", tipo: "textCsv" }], operacion: "amigos.push(a1, a2, a3)", codigo: "amigos.push('Luis','Marta','Pedro');", run: ({ base, nuevos }) => { const amigos=[...base]; amigos.push(...nuevos.slice(0,3)); return amigos; } },
    { nombre: "Push condicional", consigna: "Agregar un numero solo si es mayor al ultimo.", campos: [{ key: "numeros", label: "Numeros base (coma)", tipo: "numberCsv" }, { key: "nuevo", label: "Nuevo numero", tipo: "number" }], operacion: "if (nuevo > ultimo) arr.push(nuevo)", codigo: "if (nuevo > arr[arr.length - 1]) arr.push(nuevo);", run: ({ numeros, nuevo }) => { const arr=[...numeros]; if (nuevo > arr[arr.length-1]) arr.push(nuevo); return arr; } }
  ]},
  pop: { categoria: "mutador", variantes: [
    { nombre: "Pop animales", consigna: "Eliminar el ultimo elemento.", campos: [{ key: "animales", label: "Animales (coma)", tipo: "textCsv" }], operacion: "animales.pop()", codigo: "animales.pop();", run: ({ animales }) => { const arr=[...animales]; arr.pop(); return arr; } },
    { nombre: "Pop compras", consigna: "Quitar ultimo producto y mostrar eliminado.", campos: [{ key: "compras", label: "Compras (coma)", tipo: "textCsv" }], operacion: "const eliminado = compras.pop()", codigo: "const eliminado = compras.pop();", run: ({ compras }) => { const arr=[...compras]; const eliminado=arr.pop(); return { eliminado, array: arr }; } },
    { nombre: "Vaciar con while", consigna: "Vaciar un array con while + pop.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }], operacion: "while (arr.length) arr.pop()", codigo: "while (arr.length) arr.pop();", run: ({ numeros }) => { const arr=[...numeros]; while(arr.length) arr.pop(); return arr; } }
  ]},
  unshift: { categoria: "mutador", variantes: [
    { nombre: "Colores al principio", consigna: "Agregar tres colores al inicio.", campos: [{ key: "colores", label: "Tres colores (coma)", tipo: "textCsv" }], operacion: "colores.unshift(c1,c2,c3)", codigo: "colores.unshift('rojo','verde','azul');", run: ({ colores }) => { const arr=[]; arr.unshift(...colores.slice(0,3)); return arr; } },
    { nombre: "Tarea urgente", consigna: "Agregar tarea urgente al principio.", campos: [{ key: "tareas", label: "Tareas actuales (coma)", tipo: "textCsv" }, { key: "urgente", label: "Tarea urgente", tipo: "text" }], operacion: "tareas.unshift(urgente)", codigo: "tareas.unshift('URGENTE');", run: ({ tareas, urgente }) => { const arr=[...tareas]; arr.unshift(urgente); return arr; } },
    { nombre: "Usuario conectado", consigna: "Insertar usuario al principio.", campos: [{ key: "usuarios", label: "Usuarios conectados (coma)", tipo: "textCsv" }, { key: "nuevo", label: "Nuevo usuario", tipo: "text" }], operacion: "usuarios.unshift(nuevo)", codigo: "usuarios.unshift('Admin');", run: ({ usuarios, nuevo }) => { const arr=[...usuarios]; arr.unshift(nuevo); return arr; } }
  ]},
  shift: { categoria: "mutador", variantes: [
    { nombre: "Quitar primer numero", consigna: "Quitar primer numero.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }], operacion: "numeros.shift()", codigo: "numeros.shift();", run: ({ numeros }) => { const arr=[...numeros]; arr.shift(); return arr; } },
    { nombre: "Primer chat", consigna: "Eliminar primer mensaje.", campos: [{ key: "mensajes", label: "Mensajes (coma)", tipo: "textCsv" }], operacion: "mensajes.shift()", codigo: "const eliminado = mensajes.shift();", run: ({ mensajes }) => { const arr=[...mensajes]; const eliminado=arr.shift(); return { eliminado, array: arr }; } },
    { nombre: "Cola de atencion", consigna: "Simular cola de atencion.", campos: [{ key: "cola", label: "Clientes (coma)", tipo: "textCsv" }], operacion: "while (cola.length) atendidos.push(cola.shift())", codigo: "while (cola.length) atendidos.push(cola.shift());", run: ({ cola }) => { const c=[...cola]; const atendidos=[]; while(c.length) atendidos.push(c.shift()); return atendidos; } }
  ]},
  splice: { categoria: "mutador", variantes: [
    { nombre: "Eliminar dos", consigna: "Eliminar dos elementos desde posicion 1.", campos: [{ key: "letras", label: "Letras (coma)", tipo: "textCsv" }], operacion: "letras.splice(1,2)", codigo: "const eliminados = letras.splice(1,2);", run: ({ letras }) => { const arr=[...letras]; const eliminados=arr.splice(1,2); return { eliminados, array: arr }; } },
    { nombre: "Insertar sin eliminar", consigna: "Insertar en segunda posicion.", campos: [{ key: "nombres", label: "Nombres (coma)", tipo: "textCsv" }, { key: "nuevo", label: "Nuevo nombre", tipo: "text" }], operacion: "nombres.splice(1,0,nuevo)", codigo: "nombres.splice(1,0,'Carlos');", run: ({ nombres, nuevo }) => { const arr=[...nombres]; arr.splice(1,0,nuevo); return arr; } },
    { nombre: "Reemplazar dos", consigna: "Reemplazar dos elementos.", campos: [{ key: "base", label: "Array base (coma)", tipo: "textCsv" }, { key: "a", label: "Reemplazo 1", tipo: "text" }, { key: "b", label: "Reemplazo 2", tipo: "text" }], operacion: "arr.splice(1,2,a,b)", codigo: "arr.splice(1,2,'m','n');", run: ({ base, a, b }) => { const arr=[...base]; arr.splice(1,2,a,b); return arr; } }
  ]},
  slice: { categoria: "no mutador", variantes: [
    { nombre: "Primeros 3", consigna: "Copiar primeros 3 elementos.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }], operacion: "arr.slice(0,3)", codigo: "arr.slice(0,3);", run: ({ numeros }) => numeros.slice(0,3) },
    { nombre: "Peliculas 2 a 4", consigna: "Copiar rango de peliculas.", campos: [{ key: "pelis", label: "Peliculas (coma)", tipo: "textCsv" }], operacion: "pelis.slice(2,5)", codigo: "pelis.slice(2,5);", run: ({ pelis }) => pelis.slice(2,5) },
    { nombre: "Ultimos 3", consigna: "Obtener ultimos 3.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }], operacion: "arr.slice(-3)", codigo: "arr.slice(-3);", run: ({ numeros }) => numeros.slice(-3) }
  ]},
  indexOf: { categoria: "busqueda", variantes: [
    { nombre: "Buscar perro", consigna: "Encontrar posicion de perro.", campos: [{ key: "animales", label: "Animales (coma)", tipo: "textCsv" }], operacion: "animales.indexOf('perro')", codigo: "animales.indexOf('perro');", run: ({ animales }) => animales.indexOf("perro") },
    { nombre: "Buscar 50", consigna: "Buscar numero 50.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }], operacion: "numeros.indexOf(50)", codigo: "numeros.indexOf(50);", run: ({ numeros }) => numeros.indexOf(50) },
    { nombre: "Madrid o mensaje", consigna: "Mostrar indice de Madrid o mensaje.", campos: [{ key: "ciudades", label: "Ciudades (coma)", tipo: "textCsv" }], operacion: "ciudades.indexOf('Madrid')", codigo: "const i = ciudades.indexOf('Madrid');", run: ({ ciudades }) => { const i=ciudades.indexOf("Madrid"); return i === -1 ? "Madrid no esta" : i; } }
  ]},
  includes: { categoria: "busqueda", variantes: [
    { nombre: "Contiene admin", consigna: "Comprobar si contiene admin.", campos: [{ key: "roles", label: "Roles (coma)", tipo: "textCsv" }], operacion: "roles.includes('admin')", codigo: "roles.includes('admin');", run: ({ roles }) => roles.includes("admin") },
    { nombre: "Existe verde", consigna: "Verificar si existe verde.", campos: [{ key: "colores", label: "Colores (coma)", tipo: "textCsv" }], operacion: "colores.includes('verde')", codigo: "colores.includes('verde');", run: ({ colores }) => colores.includes("verde") },
    { nombre: "Evitar duplicado", consigna: "Agregar numero solo si no existe.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }, { key: "nuevo", label: "Numero a agregar", tipo: "number" }], operacion: "if (!arr.includes(nuevo)) arr.push(nuevo)", codigo: "if (!arr.includes(nuevo)) arr.push(nuevo);", run: ({ numeros, nuevo }) => { const arr=[...numeros]; if(!arr.includes(nuevo)) arr.push(nuevo); return arr; } }
  ]},
  forEach: { categoria: "iteracion", variantes: [
    { nombre: "Saludos", consigna: "Mostrar saludos.", campos: [{ key: "nombres", label: "Nombres (coma)", tipo: "textCsv" }], operacion: "forEach para saludar", codigo: "nombres.forEach(n => out.push(`Hola ${n}`));", run: ({ nombres }) => { const out=[]; nombres.forEach((n)=>out.push(`Hola ${n}`)); return out; } },
    { nombre: "Dobles", consigna: "Mostrar doble de numeros.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }], operacion: "forEach + push(n*2)", codigo: "numeros.forEach(n => out.push(n * 2));", run: ({ numeros }) => { const out=[]; numeros.forEach((n)=>out.push(n*2)); return out; } },
    { nombre: "Objetos nombre/edad", consigna: "Recorrer objetos nombre/edad.", campos: [{ key: "personas", label: "Personas nombre:edad (coma)", tipo: "nameAge" }], operacion: "forEach sobre objetos", codigo: "personas.forEach(p => out.push(`${p.nombre} tiene ${p.edad}`));", run: ({ personas }) => { const out=[]; personas.forEach((p)=>out.push(`${p.nombre} tiene ${p.edad}`)); return out; } }
  ]},
  map: { categoria: "transformacion", variantes: [
    { nombre: "Triples", consigna: "Multiplicar numeros por 3.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }], operacion: "map(n=>n*3)", codigo: "numeros.map(n => n * 3);", run: ({ numeros }) => numeros.map((n)=>n*3) },
    { nombre: "Mayusculas", consigna: "Convertir nombres a mayusculas.", campos: [{ key: "nombres", label: "Nombres (coma)", tipo: "textCsv" }], operacion: "map(n=>n.toUpperCase())", codigo: "nombres.map(n => n.toUpperCase());", run: ({ nombres }) => nombres.map((n)=>n.toUpperCase()) },
    { nombre: "IVA 21%", consigna: "Aplicar IVA 21%.", campos: [{ key: "precios", label: "Precios (coma)", tipo: "numberCsv" }], operacion: "map(p=>p*1.21)", codigo: "precios.map(p => +(p*1.21).toFixed(2));", run: ({ precios }) => precios.map((p)=> +(p*1.21).toFixed(2)) }
  ]},
  filter: { categoria: "transformacion", variantes: [
    { nombre: "Mayores a 10", consigna: "Filtrar numeros mayores a 10.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }], operacion: "filter(n>10)", codigo: "numeros.filter(n => n > 10);", run: ({ numeros }) => numeros.filter((n)=>n>10) },
    { nombre: "Palabras largas", consigna: "Filtrar palabras con mas de 5 letras.", campos: [{ key: "palabras", label: "Palabras (coma)", tipo: "textCsv" }], operacion: "filter(p.length>5)", codigo: "palabras.filter(p => p.length > 5);", run: ({ palabras }) => palabras.filter((p)=>p.length>5) },
    { nombre: "Usuarios activos", consigna: "Filtrar usuarios activos.", campos: [{ key: "usuarios", label: "Usuarios nombre:true|false (coma)", tipo: "nameActive" }], operacion: "filter(u.activo)", codigo: "usuarios.filter(u => u.activo);", run: ({ usuarios }) => usuarios.filter((u)=>u.activo) }
  ]},
  reduce: { categoria: "transformacion", variantes: [
    { nombre: "Suma", consigna: "Sumar todos los elementos.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }], operacion: "reduce suma", codigo: "numeros.reduce((acc, n) => acc + n, 0);", run: ({ numeros }) => numeros.reduce((a,n)=>a+n,0) },
    { nombre: "Producto", consigna: "Multiplicar todos los elementos.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }], operacion: "reduce producto", codigo: "numeros.reduce((acc, n) => acc * n, 1);", run: ({ numeros }) => numeros.reduce((a,n)=>a*n,1) },
    { nombre: "Total precios", consigna: "Total de precios de objetos.", campos: [{ key: "precios", label: "Precios (coma)", tipo: "priceObjects" }], operacion: "reduce sobre precio", codigo: "items.reduce((acc, i) => acc + i.precio, 0);", run: ({ precios }) => precios.reduce((a,i)=>a+i.precio,0) }
  ]},
  sort: { categoria: "transformacion", variantes: [
    { nombre: "Numeros asc", consigna: "Ordenar numeros de menor a mayor.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }], operacion: "sort((a,b)=>a-b)", codigo: "numeros.sort((a,b)=>a-b);", run: ({ numeros }) => [...numeros].sort((a,b)=>a-b) },
    { nombre: "Palabras alfa", consigna: "Ordenar palabras alfabeticamente.", campos: [{ key: "palabras", label: "Palabras (coma)", tipo: "textCsv" }], operacion: "sort()", codigo: "palabras.sort();", run: ({ palabras }) => [...palabras].sort() },
    { nombre: "Objetos por edad", consigna: "Ordenar objetos por edad.", campos: [{ key: "personas", label: "Personas nombre:edad (coma)", tipo: "nameAge" }], operacion: "sort por edad", codigo: "personas.sort((a,b)=>a.edad-b.edad);", run: ({ personas }) => [...personas].sort((a,b)=>a.edad-b.edad) }
  ]},
  reverse: { categoria: "mutador", variantes: [
    { nombre: "Invertir letras", consigna: "Invertir array de letras.", campos: [{ key: "letras", label: "Letras (coma)", tipo: "textCsv" }], operacion: "reverse()", codigo: "letras.reverse();", run: ({ letras }) => [...letras].reverse() },
    { nombre: "Invertir numeros", consigna: "Invertir array de numeros.", campos: [{ key: "numeros", label: "Numeros (coma)", tipo: "numberCsv" }], operacion: "reverse()", codigo: "numeros.reverse();", run: ({ numeros }) => [...numeros].reverse() },
    { nombre: "Invertir string", consigna: "Invertir string con split/reverse/join.", campos: [{ key: "texto", label: "Texto", tipo: "textFree" }], operacion: "split('').reverse().join('')", codigo: "texto.split('').reverse().join('');", run: ({ texto }) => texto.split("").reverse().join("") }
  ]},
  secreto: { categoria: "especial", variantes: [
    { nombre: "Decodificar fijo", consigna: "Decodificar mensaje fijo.", campos: [], operacion: "decodificarSecreto(texto)", codigo: "decodificarSecreto(texto);", run: () => decodificarSecreto("Hoy (.sh 22 sal a) (ed asac ne sominuer son) Marcelo.") },
    { nombre: "Mensaje propio", consigna: "Permitir ingresar mensaje propio.", campos: [{ key: "texto", label: "Texto con parentesis", tipo: "textFree" }], operacion: "decodificarSecreto(texto)", codigo: "decodificarSecreto(texto);", run: ({ texto }) => decodificarSecreto(texto) },
    { nombre: "Paso a paso", consigna: "Mostrar fragmentos invertidos paso a paso.", campos: [{ key: "texto", label: "Texto con parentesis", tipo: "textFree" }], operacion: "pasosSecreto + decodificar", codigo: "{ pasosSecreto(texto), decodificarSecreto(texto) }", run: ({ texto }) => ({ pasos: pasosSecreto(texto), salida: decodificarSecreto(texto) }) }
  ]}
};

function validateField(tipo, value, label) {
  if (tipo === "number") {
    const n = Number(value);
    if (Number.isNaN(n)) return { ok: false, error: `${label}: ingresa un numero valido.` };
    return { ok: true, value: n };
  }
  if (tipo === "text") {
    const t = String(value || "").trim();
    if (!t) return { ok: false, error: `${label}: campo obligatorio.` };
    if (!onlyLetters.test(t)) return { ok: false, error: `${label}: solo letras y espacios.` };
    return { ok: true, value: t };
  }
  if (tipo === "textFree") {
    const t = String(value || "").trim();
    if (!t) return { ok: false, error: `${label}: campo obligatorio.` };
    return { ok: true, value: t };
  }
  if (tipo === "numberCsv") return parseNumberCsv(value);
  if (tipo === "textCsv") return parseTextCsv(value, label);
  if (tipo === "nameAge") return parseNameAge(value);
  if (tipo === "nameActive") return parseNameActive(value);
  if (tipo === "priceObjects") return parsePriceObjects(value);
  return { ok: false, error: "Tipo de validacion no soportado." };
}

export function buildExercisePayload(method) {
  const def = defs[method];
  if (!def) return null;
  return {
    metodo: method,
    categoria: def.categoria,
    variantes: def.variantes.map((v, i) => ({
      id: i + 1,
      nombre: v.nombre,
      consigna: v.consigna,
      operacion: v.operacion,
      codigo: v.codigo,
      campos: v.campos
    }))
  };
}

export function executeVariant(method, variantId, rawInputs) {
  const def = defs[method];
  if (!def) return { ok: false, error: "Metodo invalido." };
  const variant = def.variantes[Number(variantId) - 1];
  if (!variant) return { ok: false, error: "Variante invalida." };

  const parsed = {};
  for (const field of variant.campos) {
    const check = validateField(field.tipo, rawInputs?.[field.key], field.label);
    if (!check.ok) return check;
    parsed[field.key] = check.value;
  }

  if (method === "secreto" && parsed.texto && !validarParentesisBalanceados(parsed.texto)) {
    return { ok: false, error: "Parentesis mal cerrados." };
  }

  return { ok: true, resultado: variant.run(parsed) };
}
// donde esta lo del secreto autogenerado
export function runSecretoCustom(texto, modo) {
  if (modo === "generar") {
    const base = [
      "hoy te llamo",
      "nos vemos tarde",
      "trae el cuaderno",
      "pasa por casa",
      "reunion a las nueve"
    ];
    const frase = base[Math.floor(Math.random() * base.length)];
    return { ok: true, resultado: cifrarSecreto(frase) };
  }

  if (typeof texto !== "string") return { ok: false, error: "El texto debe ser string." };
  const limpio = texto.trim();
  if (!limpio) return { ok: false, error: "El texto no puede estar vacio." };
  if (!validarParentesisBalanceados(limpio)) return { ok: false, error: "Parentesis mal cerrados." };
  if (modo === "cifrar") return { ok: true, resultado: cifrarSecreto(limpio) };
  if (modo === "paso") return { ok: true, resultado: { pasos: pasosSecreto(limpio), salida: decodificarSecreto(limpio) } };
  return { ok: true, resultado: decodificarSecreto(limpio) };
}
