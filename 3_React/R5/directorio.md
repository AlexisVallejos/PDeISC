# Directorio de R5

```text
R5/
├── README.md                    instalación y uso
├── arquitectura.md              responsabilidades y flujo OAuth
├── portal/                      portada de los tres sistemas
├── api/
│   ├── database/                esquemas SQLite y MySQL, semilla admin
│   ├── test/                    pruebas OAuth sin redes reales
│   └── src/
│       ├── routes/              rutas Express
│       ├── controllers/         autenticación, OAuth y usuarios
│       ├── middleware/          sesión, rol, límites y errores
│       ├── oauth/providers/     Google, Facebook, GitHub, X, Discord, Twitch
│       ├── services/            SQL y vinculación de identidades
│       └── validators/          validación de datos del servidor
├── sistema-1/                   Control nocturno
├── sistema-2/                   Estudio editorial
└── sistema-3/                   Atelier modular
```

Cada `sistema-*` contiene `cliente-usestate/`, `cliente-router/` y `cliente-next/`. Los clientes Vite tienen `src/components/` para la interfaz, `src/context/` para sesión y tema, `src/hooks/` para cargas, `src/services/` para Axios, `src/validation/` para formularios y `src/styles/` para la presentación; los clientes Next guardan sus estilos en `src/app/globals.css`.

Los clientes Router resuelven el retorno OAuth en `pages/OAuthCallbackPage.tsx`. Los clientes `useState` detectan la ruta de callback en `App.tsx` y muestran su propia página de estado. Los clientes Next lo resuelven en `app/auth/[provider]/callback/page.tsx`. Las nueve variantes usan los mismos endpoints y las mismas reglas del servidor.

```text
cliente-next/src/
├── app/                 rutas: ingresar, registro, (panel)/perfil, (panel)/usuarios, auth/[provider]/callback
├── proxy.ts             chequeo optimista de la cookie de sesión
├── components/
│   ├── auth/ admin/ profile/ common/ guards/   comportamiento (igual en los tres sistemas)
│   ├── nexo/ | estudio/ | atelier/             presentación y escena 3D de cada sistema
│   └── reactbits/                              componentes de React Bits
├── context/ hooks/ services/ validation/ utils/ types/
```
