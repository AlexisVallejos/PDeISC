# MacroEntreno: el código explicado, archivo por archivo

Guía para exponer el proyecto. Explica qué hace cada archivo y cada función, paso a paso y en el orden en que se ejecuta. Los números entre paréntesis son líneas del archivo.

## Índice

| # | Documento | Qué cubre |
|---|---|---|
| 1 | [Backend: base](01-backend-base.md) | `server.js`, `app.js`, configuración, base de datos, migraciones, middlewares y utilidades |
| 2 | [Backend: autenticación](02-backend-auth.md) | Registro con código, login, contraseña, JWT, login social con PKCE |
| 3 | [Backend: usuarios, cuerpo y diario](03-backend-usuarios-cuerpo-diario.md) | Usuarios y roles, panel del admin, **cálculo nutricional**, planes del coach y diario |
| 4 | [Backend: alimentos y entrenamientos](04-backend-alimentos-entrenamientos.md) | Catálogo, FatSecret, Open Food Facts, USDA, micronutrientes, ejercicios y sesiones |
| 5 | [Backend: progreso, informes e IA](05-backend-progreso-informes-ia.md) | Progreso, informes semanales y mensuales en PDF, asistente con OpenAI y Vercel |
| 6 | [App: base y navegación](06-app-base-navegacion-sesion.md) | Cliente HTTP, sesión, login social, rutas protegidas por rol y validaciones |
| 7 | [App: tema y componentes](07-app-tema-componentes-login.md) | Tema claro/oscuro, componentes reutilizables y pantallas de acceso |
| 8 | [App: inicio, diario y catálogo](08-app-inicio-diario-catalogo.md) | Inicio de cada rol, registrar comidas (escáner, foto con IA) y catálogo |
| 9 | [App: entrenos, usuarios e informes](09-app-entrenos-usuarios-planes-informes.md) | Sesiones, gestión de usuarios, planes, perfil, progreso e informes |
| 10 | [App: asistente, cuerpo y cámara](10-app-asistente-cuerpo-camara.md) | Chat con voz, datos corporales y entrenador con cámara (MediaPipe) |

## Recorrido completo para la defensa: un usuario se registra y carga una comida

1. **App**: en `RegisterScreen` se completa el formulario. `validateRegister` revisa los datos en el celular, antes de enviar nada.
2. **App**: `AuthContext.register` llama a `authApi.register`, que usa `publicApi`, que a su vez usa `rawRequest` para hacer el `fetch`.
3. **API**: Express recibe `POST /api/auth/register`. La petición pasa por `authLimiter`, que limita los intentos, y después por `validate(registerSchema)`, que vuelve a validar los datos con zod.
4. **API**: `auth.service.register` guarda el hash de la contraseña con bcrypt, crea al usuario como atleta y `sendCode` envía el código de 6 dígitos por email.
5. **App**: se abre `VerifyEmailScreen`. El usuario escribe el código y se llama a `verifyEmail`.
6. **API**: `consumeCode` comprueba el código (dentro de una transacción). Si es correcto, `issueTokens` crea el JWT de acceso y el refresh token.
7. **App**: `startSession` guarda los tokens en SecureStore y despacha `SIGN_IN`. Al cambiar el estado, `Stack.Protected` muestra las pestañas del atleta.
8. **App**: en `DiaryEntryScreen` el usuario busca "milanesa", la elige, carga 200 g y guarda.
9. **API**: `POST /api/diary` pasa por `authenticate`, que valida el JWT y vuelve a leer al usuario de la base. Después `createEntrySchema` valida los datos y `diary.service.createEntry` **calcula los macros en el servidor** con `scaleFood`.
10. **App**: al volver a la pestaña, `useResource` recarga el día y `MacroSummary` actualiza los anillos de calorías y macros.

## Ideas clave para explicar

- **Validación en dos capas**: la app valida para que el usuario reciba la respuesta al instante, y el servidor vuelve a validar con zod, porque es la única validación en la que se puede confiar. Las dos usan las mismas reglas.
- **Seguridad**:
  - Las contraseñas se guardan con bcrypt.
  - Los tokens y los códigos se guardan como hash.
  - Las consultas SQL son parametrizadas, lo que evita la inyección SQL.
  - Hay límites de intentos.
  - El algoritmo del JWT está fijado.
  - Los refresh tokens se rotan y se detecta si uno se reutiliza.
  - El login social usa PKCE y no vincula cuentas automáticamente si el email no está verificado.
  - Las respuestas no revelan qué emails están registrados.
- **Roles**:
  - En el servidor, `authorize` y `resolveTargetUser` controlan quién puede hacer qué.
  - En la app, `Stack.Protected` y `Tabs.Protected` muestran solo lo que corresponde a cada rol.
- **Patrón del backend**: routes, después service y después MySQL. Los errores se convierten en un JSON uniforme en `errorHandler`.
- **Una sola app para todas las plataformas**: Android, iOS y la web salen del mismo código. Algunos archivos tienen una versión `.web.js` que Expo usa automáticamente en el navegador.
