# Proyecto 4: Archivos de numeros

Aplicacion web para cargar entre 10 y 20 numeros, editarlos, borrarlos y descargar un archivo `.txt`. Tambien permite subir un `.txt`, leer sus numeros, filtrar los que empiezan y terminan con el mismo digito, ordenar el resultado de forma ascendente, calcular porcentajes y descargar el filtrado final.

## Requisitos cubiertos

- Ingreso minimo de 10 numeros y maximo de 20.
- Muestra los numeros a medida que se cargan.
- Alta, modificacion y baja de numeros cargados.
- Modo claro y oscuro.
- Formulario distribuido en horizontal.
- Fecha visible en formato dia/mes/anio.
- Descarga de archivo `.txt` con los numeros originales.
- Subida y lectura de archivos `.txt`.
- Filtrado de numeros utiles: ejemplo `525` si cumple, `123` no.
- Orden ascendente de numeros utiles.
- Contador de numeros utiles y no utiles.
- Porcentaje de numeros utiles.
- Concatenacion de numeros en pantalla y dentro del archivo.
- Descarga de un nuevo `.txt` con el resultado filtrado.

## Estructura

- `server.js` - servidor estatico, puerto **4004**
- `public/index.html`
- `public/css/style.css`
- `public/js/archivos-numeros.js`

## Como ejecutar

```bash
npm start
```

Abrir `http://localhost:4004`.
