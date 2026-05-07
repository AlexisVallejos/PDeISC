# Proyecto 3: Almacén de Personas (localStorage)

Aplicación web que permite registrar personas mediante un formulario y almacenarlas en `localStorage`. Todos los campos están validados por JavaScript y el feedback de éxito/error se muestra dinámicamente.

## Campos
- Nombre
- Apellido
- Edad
- Fecha de nacimiento
- Sexo (Masculino / Femenino)
- Documento
- Estado civil
- Nacionalidad
- Teléfono
- Mail
- Hijos (Sí / No → si tiene, cantidad)

## Validaciones
- Nombre/Apellido: solo letras y espacios, mín. 2 caracteres.
- Edad: 0–120, coherente con la fecha de nacimiento.
- Documento: 7 u 8 dígitos numéricos, único.
- Teléfono: 6–15 dígitos.
- Mail: formato válido.
- Hijos: si "Sí", cantidad obligatoria > 0.

## Estructura
- `public/`
  - `css/style.css`
  - `js/almacen.js`
  - `index.html`
- `server.js` - Puerto **4003**

## Cómo ejecutar
1. `node server.js`
2. Abrir `http://localhost:4003`.

Los datos persisten en el navegador (localStorage). Botón "Vaciar almacén" para borrar todo.
