# JS1: Ejercicio 2 - Registro de Socios (AFA ID)

Este proyecto cumple con los requisitos del segundo ejercicio de JavaScript:
1. **Página dinámica**: No se recarga al enviar el formulario.
2. **Al menos 8 campos**:
   1. Tipo de Documento
   2. Número de Documento (Solo números)
   3. Número de Trámite del DNI
   4. Nacionalidad
   5. Sexo (Masculino, Femenino, No Binario)
   6. Correo Compuesto (con select de .com, .ar, etc.)
   7. Teléfono Compuesto (Prefijo internacional dinámico + [9 si es arg] + área + número)
   8. Contraseña Segura (Validación visual de mayúscula, minúscula, número, especial, min 12 char)
   9. Método de Inserción (Permite elegir si guardar usando `.push()` o `.unshift()`).
3. **Diferentes métodos de almacenaje**: Se guardan los datos en un Array de Javascript usando `.push()` (al final) y `.unshift()` (al principio). Además, se añade persistencia local con `localStorage`.
4. **Diseño Premium**: Estilo corporativo de la AFA (Asociacion del Futbol Argentino), con paleta celeste, dorado y azul noche. Responsivo al 100%, con efectos glassmorphism y micro-animaciones.
5. **Validación Frontend/Backend**: Validaciones muy estrictas mediante Regex y atributos HTML.
6. **Sin Alerts**: Uso de notificaciones Toast elegantes.
7. **Documentación e Identación**: Proyecto documentado y ordenado.

## Ejecución

1. Entra a `2_JS/JS1/Ejercicio2_River`.
2. `npm install`
3. `npm start`
4. Visita `http://localhost:3002`.
