# Arquitectura de R5

R5 extiende R3 sin cambiar su división principal: una API compartida y nueve clientes independientes. Los tres `sistema-*` tienen tres variantes (`useState`, React Router y Next.js) y comparten la misma base SQL.

```text
portal (4005) ── enlaces ──► nueve clientes (5181–5189)
                              │
                              └── Axios ──► API Express (4005)
                                             ├── SQLite o MySQL
                                             └── proveedores OAuth
```

## Responsabilidades

- `api/src/routes/`: contratos HTTP. Las operaciones de la aplicación usan POST. El proveedor vuelve por GET a `/api/auth/oauth/return/:provider`.
- `api/src/controllers/`: entrada y salida HTTP, sin consultas SQL directas.
- `api/src/services/users/`: consultas parametrizadas, creación, edición y vinculación de identidades.
- `api/src/oauth/providers/`: construcción de URL y consulta de perfil para Google, Facebook Login (Meta), GitHub, X, Discord y Twitch.
- `sistema-*/cliente-*/src/services/`: llamadas Axios. `context/` mantiene la sesión; `hooks/` coordina cargas; `components/` renderiza formularios y paneles.
- `sistema-*/cliente-next/src/app/`: rutas del App Router. `proxy.ts` redirige sin cookie de sesión; `components/guards/AuthGate.tsx` protege por rol en el cliente. Los componentes de comportamiento (`auth/`, `admin/`, `profile/`, `common/`) son iguales en los tres sistemas; la presentación y la escena 3D están en `nexo/`, `estudio/` y `atelier/`.

## Flujo OAuth

1. El cliente pide por POST `/api/auth/oauth/url` la URL del proveedor y envía su origen. La API lo valida contra `CLIENT_URLS`, genera `state` y guarda origen y verificador PKCE en cookie `httpOnly`.
2. La persona autoriza el ingreso en el proveedor. Todas las variantes usan **una URL de retorno por proveedor**: `PUBLIC_URL/api/auth/oauth/return/<proveedor>`.
3. La API comprueba `state` y redirige al cliente de origen, a su ruta `/auth/<proveedor>/callback` (en Next.js es `app/auth/[provider]/callback/page.tsx`). El cliente envía el código por POST a `/api/auth/oauth/callback`.
4. La API valida y consume el `state`, canjea el código desde el servidor, obtiene un correo verificado y busca, vincula o crea el usuario. Devuelve una sesión en la cookie `r5_session`.

El rol se consulta desde la base en cada pedido protegido. Los secretos OAuth y el JWT nunca se guardan en los clientes. La cookie de sesión de R5 tiene nombre propio para poder ejecutar R3 y R5 a la vez en `localhost`.

## Base de datos

`roles` define `administrador` y `usuario`; `usuarios` guarda perfil y contraseña opcional; `identidades_oauth` vincula `(proveedor, proveedor_uid)` con un usuario. Hay esquemas SQLite y MySQL. El borrado de usuario elimina sus identidades por clave foránea.

## Pruebas

`npm test` ejecuta pruebas unitarias y de flujo completo con SQLite temporal y proveedores simulados. Cubre retorno al cliente correcto, `state`, PKCE, cuentas nuevas, vinculación por correo verificado y rechazo de correos no verificados.
