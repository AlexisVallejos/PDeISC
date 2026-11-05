# Guía de estudio: dónde está cada cosa

Esta guía es un mapa: te dice **qué archivo abrir** para cada función de la app y qué decir cuando lo expliques. El detalle línea por línea está en los documentos 01 a 10.

> Rutas: `backend/src/...` es el servidor (Node + Express + MySQL). `mobile/src/...` es la app (Expo + React Native; la misma sirve para Android, iPhone y web).

---

## 1. La idea en 30 segundos

MacroEntreno es una app de **nutrición y gimnasio** con tres roles:
- **Atleta**: registra comidas y entrenamientos, ve su progreso y usa el asistente con IA.
- **Entrenador (coach)**: sigue a sus atletas y les asigna rutinas y planes de alimentación.
- **Administrador**: gestiona usuarios, entrenadores, el catálogo y los reportes.

Arquitectura: **app → API REST → base MySQL**. La app nunca toca la base; todo pasa por la API, que valida y controla permisos.

| Capa | Tecnología | Dónde está publicada |
|---|---|---|
| App | Expo SDK 58, Expo Router, React Native | Web en Vercel + APK con EAS |
| API | Node.js, Express 5, zod, JWT | Vercel (función serverless `api/index.mjs`) |
| Base de datos | MySQL | EasyPanel |
| IA | OpenAI (Responses API, voz y transcripción) | Desde la API |

---

## 2. Mapa: función → archivos

### Arranque y estructura
| Qué | Backend | App |
|---|---|---|
| Punto de entrada | `server.js` (levanta el servidor), `app.js` (arma Express: CORS, seguridad, rutas) | `app/_layout.jsx` (proveedores y navegación raíz) |
| Configuración y `.env` | `config/env.js` | `app.json`, `eas.json` (URL de la API del APK) |
| Base de datos | `config/db.js` (conexión), `config/migrations.js`, `database/schema.sql` | — |
| Errores en JSON uniforme | `middlewares/errorHandler.js`, `utils/httpError.js` | `api/client.js` los convierte en mensajes |
| Publicación en Vercel | `api/index.mjs`, `vercel.json` (rutas, cabeceras, cron) | — |

### Registro, login y seguridad
| Qué | Backend | App |
|---|---|---|
| Registro con código por email | `modules/auth/auth.service.js` (`register`), `emailCodes.js`, `utils/mailer.js` (Gmail SMTP) | `features/auth/RegisterScreen.jsx`, `VerifyEmailScreen.jsx` |
| Login y tokens (JWT) | `auth.service.js` (`login`), `tokens.js` (access + refresh rotativo) | `context/AuthContext.jsx`, `storage/tokenStorage.js` |
| Proteger rutas | `middlewares/auth.js` (`authenticate`, `authorize`) | `app/(app)/_layout.jsx` y `(tabs)/_layout.jsx` con `Stack.Protected` / `Tabs.Protected` |
| Login con Google, Facebook, GitHub | `oauth.js` (PKCE + state firmado), `socialProviders.js`, `auth.routes.js` (callback) | `api/socialLogin.js`, `features/auth/SocialButtons.jsx`, `app/oauth-callback.jsx` |
| Verificar el email en login social | `auth.service.js` (`socialLoginStep`, `sessionForUser`) | redirige a `/verify-email` |
| Olvidé / cambiar contraseña | `auth.service.js` (`forgotPassword`, `resetPassword`, `changePassword`) | `ForgotPasswordScreen.jsx`, `features/profile/ChangePasswordScreen.jsx` |
| Quién puede ver a quién | `utils/access.js` (`resolveTargetUser`) | — |
| Validaciones | `utils/validation.js` (zod: `passwordField`, `checkMacros`, `assertMacros`) + cada `*.schemas.js` | `utils/validation.js` (las mismas reglas) |

### Asistente con IA (lo que más te van a preguntar)
| Qué | Archivo |
|---|---|
| Conexión con OpenAI, reintentos, errores en español | `backend/src/modules/ai/openai.js` |
| **Instrucciones y restricciones** (solo salud y entrenamiento) | `backend/src/modules/ai/ai.service.js` → función `instructions` (bloque "Alcance") |
| Bucle de herramientas (el modelo pide acciones y la API las ejecuta) | `ai.service.js` → función `chat` |
| **Qué puede hacer la IA** (registrar comida, crear rutina, buscar alimentos…) | `backend/src/modules/ai/ai.tools.js` (`TOOLS` y `HANDLERS`) |
| Analizar la foto de un plato | `ai.service.js` → `analyzeFoodPhoto` (con `FOOD_PHOTO_SCHEMA`) |
| Rutas, límite de uso, tamaños | `backend/src/modules/ai/ai.routes.js` |
| Velocidad (razonamiento bajo) | `openai.js` → `createResponse({ fast: true })`; `env.js` → `OPENAI_REASONING` |
| Pantalla del chat (Enter envía, micrófono, fotos) | `mobile/src/features/assistant/AssistantScreen.jsx` |
| Voz (grabar y escuchar) | `features/assistant/voice.js` (celular) y `voice.web.js` (navegador) |
| Foto del plato en el diario | `features/diary/FoodPhotoCard.jsx` |

**Cómo explicarlo:** "El modelo no toca la base. Cuando el usuario dice *anotá 2 huevos*, el modelo pide la herramienta `registrar_comida`; la API la ejecuta con **los mismos permisos y validaciones** que si el usuario lo hiciera a mano, y le devuelve el resultado. La clave de OpenAI vive solo en el servidor."

**Restricción de temas:** si le piden una página web, código, tareas o chistes, contesta siempre la misma frase y no da información. Está en el bloque *Alcance* de `instructions`.

### Diario de comidas
| Qué | Backend | App |
|---|---|---|
| Día con totales y metas | `modules/diary/diary.service.js` (`getDay`) | `features/diary/DiaryScreen.jsx`, `DiaryDay.jsx` |
| Registrar / editar comida | `diary.service.js` (`createEntry`, `updateEntry`, `scaleFood`) | `features/diary/DiaryEntryScreen.jsx` |
| Micronutrientes | `modules/nutrition/micros.js` | `components/Micros.jsx` |
| Anillos de calorías y macros | — | `components/Macros.jsx`, `ProgressRing.jsx` |

### Alimentos y catálogo
| Qué | Archivo |
|---|---|
| CRUD de alimentos | `backend/src/modules/foods/foods.service.js`, `foods.routes.js`, `foods.schemas.js` |
| Bases externas | `foods/fatsecret.js`, `openfoodfacts.js`, `usda.js` |
| Pantallas | `mobile/src/features/catalog/` (`FoodsScreen`, `FoodList`, `FoodFormScreen`, `ExerciseList`, `ExerciseFormScreen`) |

### Entrenamientos
| Qué | Backend | App |
|---|---|---|
| Sesiones (crear, editar, completar) | `modules/workouts/workouts.service.js`, `workouts.routes.js` | `features/workouts/WorkoutsScreen.jsx`, `WorkoutFormScreen.jsx`, `WorkoutCard.jsx` |
| Catálogo de ejercicios | `modules/exercises/exercises.routes.js` | `features/workouts/ExercisePicker.jsx` (con buscador) |
| Entrenador con cámara (cuenta repeticiones) | — | `features/coach/` (`pose/engine.js` cuenta, `pose/rules.js` reglas por ejercicio, `landmarker.web.js` MediaPipe) |

### Datos corporales y metas (cálculo nutricional)
| Qué | Archivo |
|---|---|
| **Fórmulas** (Mifflin-St Jeor, Katch-McArdle, TDEE, macros) | `backend/src/modules/body/energy.js` |
| Validación (rangos e IMC posible) | `body/body.schemas.js` |
| Guardar y pasar las metas al diario | `body/body.service.js` |
| Pantalla | `mobile/src/features/body/BodyProfileScreen.jsx` |
| Metas manuales | `users/users.schemas.js` (`goals`), app: `features/users/GoalsForm.jsx` |

### Entrenador (coach)
| Qué | Backend | App |
|---|---|---|
| Inicio con sus atletas | `modules/coaching/coaching.routes.js` (`dashboard`) | `features/home/CoachHome.jsx` |
| Ficha del atleta | `users/users.routes.js` | `features/users/AthleteDetailScreen.jsx` |
| Planes de alimentación | `coaching/nutrition.service.js` | `features/nutrition/NutritionPlansScreen.jsx`, `NutritionPlanFormScreen.jsx` |

### Administrador
| Qué | Backend | App |
|---|---|---|
| Estadísticas | `modules/admin/admin.routes.js` | `features/home/AdminHome.jsx` |
| Usuarios y roles | `modules/users/users.service.js`, `users.routes.js` | `features/users/UsersScreen.jsx`, `UserFormScreen.jsx` |
| Reporte mensual de entrenadores (PDF) | `modules/reports/reports.service.js` (`monthlyCoaches`), `reports.pdf.js` | `features/reports/CoachReportsScreen.jsx` |

### Progreso e informes
| Qué | Backend | App |
|---|---|---|
| Progreso 7/14/30 días y fuerza | `modules/progress/progress.routes.js` | `features/progress/ProgressScreen.jsx`, `ProgressView.jsx` |
| Informe semanal (cada lunes) + PDF | `reports/reports.service.js` (`weeklySnapshot`, `generateDueWeeklyReports`), `reports.pdf.js` | `features/reports/WeeklyReportsScreen.jsx`, `WeeklyReview.jsx` |
| Fechas en hora argentina | `reports/periods.js`, `utils/dates.js` | `utils/dates.js` |

### Interfaz común
| Qué | Archivo |
|---|---|
| Tema claro / oscuro y colores | `mobile/src/theme/index.js`, `components/ThemeSwitch.jsx` |
| Contenedor de pantalla + **botón volver arriba** | `components/Screen.jsx` |
| **Ayuda la primera vez + botón ?** | `features/help/HelpContext.jsx`, `features/help/guides.js`, capturas en `mobile/assets/help/` |
| Botones, tarjetas, campos | `components/Button.jsx`, `Card.jsx`, `TextField.jsx`, `Chips.jsx` |
| Cargar datos de una pantalla | `hooks/useResource.js` |
| Llamadas a la API | `api/client.js` (renueva el token solo), `api/endpoints.js` (todas las rutas) |

---

## 3. Tres recorridos para contar en la defensa

**A. Registrarse y entrar**
`RegisterScreen` valida → `AuthContext.register` → `POST /api/auth/register` → zod valida de nuevo → bcrypt guarda el hash → `emailCodes` manda el código por Gmail → `VerifyEmailScreen` → `verifyEmail` → `tokens.js` crea JWT y refresh → la app guarda los tokens y `Stack.Protected` muestra las pestañas del rol.

**B. Pedirle algo a la IA**
`AssistantScreen` envía el historial → `POST /api/ai/chat` → `chat()` arma las instrucciones (con las restricciones) → OpenAI decide usar `registrar_comida` → `ai.tools.js` valida con el mismo esquema del diario y guarda → devuelve los totales → el modelo responde corto → la app muestra la respuesta y un aviso "1 comida registrada" que lleva al diario.

**C. Calcular las metas**
`BodyProfileScreen` → `POST /api/body` → `body.schemas.js` valida rangos e IMC → `energy.js`: BMR (Mifflin o Katch) × actividad = TDEE → ajuste según objetivo con límites de seguridad (máx. 25 % de déficit, nunca bajo el basal) → proteína por kg → grasas 25-35 % → carbohidratos el resto → se guardan como metas del diario.

---

## 4. Preguntas típicas y dónde está la respuesta

| Pregunta | Respuesta corta | Archivo |
|---|---|---|
| ¿Cómo guardan las contraseñas? | Hash con bcrypt, nunca en texto. | `auth.service.js` |
| ¿Qué pasa si roban un token? | El access dura 15 min; el refresh rota y si se reutiliza se cierran todas las sesiones. | `tokens.js` |
| ¿Cómo evitan inyección SQL? | Consultas parametrizadas (`?`). | `config/db.js`, cualquier `*.service.js` |
| ¿Por qué validan dos veces? | La app valida para dar respuesta rápida; el servidor porque es lo único confiable. | `utils/validation.js` (ambos lados) |
| ¿Un atleta puede ver datos de otro? | No: `resolveTargetUser` devuelve 403. | `utils/access.js` |
| ¿La IA puede hacer cualquier cosa? | No: solo sus 7 herramientas, con los permisos del usuario, y solo temas de salud. | `ai.tools.js`, `ai.service.js` |
| ¿Por qué la IA responde rápido? | Razonamiento bajo, respuestas cortas y herramientas en paralelo. | `openai.js`, `ai.service.js` |
| ¿Cómo calculan las calorías? | Mifflin-St Jeor (o Katch-McArdle con % de grasa) × actividad, más el objetivo. | `energy.js` |
| ¿Cómo funciona el login con Google? | OAuth con PKCE y `state` firmado; si el email es nuevo, se verifica con código. | `oauth.js`, `socialLogin.js` |
| ¿Cómo es una sola app para todo? | Expo/React Native; los archivos `.web.js` se usan solo en el navegador. | `features/coach/*.web.*`, `utils/savePdf.web.js` |
| ¿Cómo se prueban? | 209 tests del backend (`node:test` + supertest) y 64 de la app. | `backend/test/`, `mobile/test/` |

---

## 5. Comandos útiles

```bash
# API local con base en memoria (usuarios demo, contraseña Demo1234)
cd backend && npm run dev:memory

# App en el navegador
cd mobile && npx expo start --web

# Tests
cd backend && npm test
cd mobile && npm test

# Publicar la web y la API
cd 5_ProyectoFinal && npx vercel --prod

# Generar el APK
cd mobile && npx eas-cli build -p android --profile preview
```
