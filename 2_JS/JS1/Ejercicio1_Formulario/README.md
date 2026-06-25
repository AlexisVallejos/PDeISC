# JS1: Ejercicio 1 - Formulario Dinámico

Este proyecto cumple con los requisitos del primer ejercicio de JavaScript:
1. **Página dinámica**: No se recarga al enviar el formulario (manejado vía `e.preventDefault()` y `fetch`).
2. **3 formas de lectura de formularios**:
   - `document.getElementById`
   - `document.forms`
   - `FormData`
   (Seleccionable desde el UI para demostración).
3. **Archivos separados**: CSS, JS y HTML están completamente separados (`/public/css/style.css`, `/public/js/main.js`, `/public/js/formHandlers.js`).
4. **Responsive y Premium Design**: Diseño responsivo usando CSS puro, sin Tailwind, con glassmorphism, modo oscuro por defecto y notificaciones animadas.
5. **Atomización**: Lógica separada por responsabilidades (Helpers, Handlers, Controllers).
6. **Identación**: Código limpio y formateado.
7. **Funcionalidad**: Lista dinámica de usuarios actualizable en tiempo real.
8. **Sin alerts**: Se implementó un sistema de Toast notifications nativo.
9. **Validaciones HTML y Backend**: 
   - Nombre: Min 3, Max 100, sin números.
   - Apellido: Min 2, Max 100, sin números.
   - Correo: Debe tener `@` y terminar en `.com`.
10. **Envío de correos**: Uso de `nodemailer` con Ethereal Email para simular de forma funcional el envío de un correo tras un registro exitoso.
11. **Gitignore**: Archivo configurado (`node_modules` y `.env` excluidos).
12. **Servidor y Puerto**: Servidor Node.js + Express corriendo en el puerto 3001.

## Cómo ejecutar

1. Clonar este repositorio.
2. Navegar a esta carpeta (`2_JS/JS1/Ejercicio1_Formulario`).
3. Instalar dependencias: `npm install`.
4. (Opcional) Configurar el `.env` copiando el `.env.example`.
5. Ejecutar: `npm start` o `npm run dev`.
6. Abrir en el navegador: `http://localhost:3001`.

## Demostración

- Ingresa datos válidos.
- Observa la notificación y la lista actualizada en tiempo real.
- Verifica en la terminal de Node.js que se muestra un enlace de Ethereal Email para visualizar el correo enviado.
