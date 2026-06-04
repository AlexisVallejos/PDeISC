# Filtrar TXT

Aplicacion web que permite al usuario subir un archivo `.txt`, leer sus numeros, filtrar los que empiezan y terminan con el mismo digito, mostrar resultados y guardar un nuevo `.txt` con el filtrado. Los numeros de un solo digito no se consideran utiles porque no tiene sentido comparar inicio y final en un unico digito.

## Consigna cubierta

El proyecto permite subir archivos `.txt` como el generado en Crear TXT. Lee el contenido, extrae los numeros y filtra los que empiezan y terminan con el mismo digito, por ejemplo `525` cumple y `123` no. Los numeros de un solo digito tampoco cumplen. En pantalla muestra los numeros que cumplen ordenados de forma ascendente, calcula el porcentaje de numeros utiles, cuenta utiles y no utiles, muestra los factoriales encontrados y permite descargar un nuevo `.txt` con el resultado del filtrado.

## Requisitos cubiertos

- Subida y lectura de archivos `.txt`.
- Validacion de archivo: extension `.txt`, texto plano, contenido no vacio y peso maximo de 1 MB.
- Validacion de contenido: solo se aceptan numeros validos separados por espacios o saltos de linea.
- Acepta enteros y decimales con punto, por ejemplo `525` y `12.5`. No acepta coma decimal.
- Filtra numeros de al menos dos digitos que empiezan y terminan con el mismo digito.
- Ordena el resultado de forma ascendente.
- Cuenta numeros utiles y no utiles.
- Calcula porcentaje de utiles.
- Detecta factoriales enteros dentro del archivo.
- Descarga un nuevo `.txt` con el resultado filtrado.
- El usuario puede guardar su descarga donde quiera.
- El backend guarda otra copia con fecha/hora en `archivos-servidor/`.
- Diseno oscuro violeta/morado.

## Estructura

- `server.js` - servidor estatico, puerto **4005**
- `public/page/index.html`
- `public/css/style.css`
- `public/js/filtrar-txt.js`
- `archivos-servidor/`

## Como ejecutar

```bash
npm start
```

Abrir `http://localhost:4005`.
