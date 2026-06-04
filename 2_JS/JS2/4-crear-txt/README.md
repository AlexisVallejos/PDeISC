# Crear TXT

Aplicacion web para cargar entre 10 y 20 numeros, editarlos, borrarlos y descargar un archivo `.txt`.

## Requisitos cubiertos

- Ingreso minimo de 10 numeros y maximo de 20.
- Validacion completa del ingreso: campo obligatorio, formato numerico valido, limite de caracteres, maximo de carga y edicion existente.
- Acepta enteros y decimales con punto, por ejemplo `525` y `12.5`. No acepta coma decimal.
- Muestra los numeros cargados.
- Alta, modificacion y baja de numeros.
- Descarga de archivo `.txt` con los numeros originales.
- El usuario puede guardar su descarga donde quiera.
- El backend guarda otra copia con fecha/hora en `archivos-servidor/`.
- Diseno oscuro violeta/morado.

## Estructura

- `server.js` - servidor estatico, puerto **4004**
- `public/page/index.html`
- `public/css/style.css`
- `public/js/crear-txt.js`
- `archivos-servidor/`

## Como ejecutar

```bash
npm start
```

Abrir `http://localhost:4004`.
