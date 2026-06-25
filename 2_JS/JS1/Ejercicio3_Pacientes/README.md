# JS1: Ejercicio 3 - Sistema de Registro de Pacientes

Este proyecto es un sistema profesional de admisión médica que cumple con los siguientes requisitos técnicos y funcionales:

## Características Destacadas
1. **Validaciones Realistas**:
   - **Nombre y Apellido**: Solo letras y espacios.
   - **DNI**: 7 u 8 dígitos numéricos.
   - **Teléfono**: Entre 10 y 15 dígitos numéricos.
   - **Email**: Formato estándar verificado.
   - **Duplicados**: El sistema impide registrar dos veces el mismo DNI o Email (validación en Frontend vía LocalStorage y en Backend vía memoria).
2. **Lógica de Edad Inteligente**:
   - Al seleccionar la **Fecha de Nacimiento**, el sistema calcula automáticamente la edad del paciente.
   - Muestra una advertencia visual si el paciente es **menor de edad**.
3. **Formulario Dinámico**:
   - El campo "Cantidad de Hijos" solo aparece si se selecciona la opción "Sí".
4. **Diseño de Alto Nivel (Premium UX/UI)**:
   - Interfaz limpia con tipografía *Outfit*.
   - **Retroalimentación visual**: Bordes verdes para campos válidos y rojos para inválidos en tiempo real.
   - Mensajes de error específicos debajo de cada campo.
5. **Notificaciones por Email**:
   - El servidor utiliza Nodemailer para enviar un correo de bienvenida simulado (Ethereal Email) al registrar un paciente.
6. **Arquitectura Node.js**:
   - Servidor independiente en el puerto **3003**.

## Ejecución
1. Navega a la carpeta `2_JS/JS1/Ejercicio3_Pacientes`.
2. Ejecuta `npm install` para instalar dependencias.
3. Ejecuta `npm start` para iniciar el servidor.
4. Abre `http://localhost:3003` en tu navegador.
