# JS0

Trabajo integrador de metodos de arrays con Node.js puro y JavaScript del lado del cliente.

## Estructura

- `server.js`: launcher principal en `http://localhost:3000`.
- `pages/`: home del launcher.
- `modules/ejercicioXX_*`: ejercicios reales que corren en puertos `3001` a `3015`.
- `scripts/`: codigo del launcher.
- `styles/`: temas claro y oscuro.
- `tools/start-all.js`: arranque rapido de todos los servidores.

## Como correrlo

1. Ejecutar `node server.js` en esta carpeta.
2. Abrir `http://localhost:3000`.
3. Desde el launcher abrir cada metodo en su puerto.

## Scripts utiles

- `npm run start`: inicia el launcher.
- `npm run start:all`: inicia launcher y modulos.
- `npm run start:push` a `npm run start:secreto`: inicia un metodo puntual.

## Requisitos cubiertos

- Navegacion clara desde un solo punto de entrada.
- Tema claro y oscuro.
- Validaciones en cada variante.
- Codigo modular y reutilizable.
- Layout mas ancho en escritorio.
- Separacion entre launcher, dataset y ejercicios.

