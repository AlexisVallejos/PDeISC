# Proyecto: 15-extra Mensajes secretos

Actividad extra basada en el problema `SECRETO` de OIA 2004.

El proyecto permite ingresar un mensaje codificado y decodificarlo. Cada fragmento encerrado entre paréntesis se lee al revés y los paréntesis se eliminan.

## Ejemplo

Entrada:

```text
Hoy (.sh 22 sal a) (ed asac ne sominuer son) Marcelo.
```

Salida:

```text
Hoy a las 22 hs. nos reunimos en casa de Marcelo.
```

## Cómo ejecutar

1. `npm install`
2. `node server.js`
3. Abrir `http://localhost:3015` en el navegador.
