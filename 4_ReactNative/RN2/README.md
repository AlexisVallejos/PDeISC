# DAMAC Lab

App React Native + Expo para explorar las herramientas del teléfono: cámara, lector QR/barras, ubicación, sensores, biometría y funciones del sistema. Reutiliza el tema claro/oscuro y los componentes visuales de DAMAC Acceso.

## Arranque

```sh
npm install
npx expo start
```

Escaneá el QR con Expo Go. Las pantallas de cámara, ubicación y sensores piden acceso al entrar, explican el uso y ofrecen abrir Ajustes si el permiso se deniega.

## Herramientas

| Herramienta | Paquete principal | Permiso | Demostración |
|---|---|---|---|
| Cámara | `expo-camera` | Cámara | Vista previa, cambio de lente, linterna, captura y guardado/compartir |
| Lector | `expo-camera` | Cámara | QR y códigos de barras, historial local |
| GPS | `expo-location` | Ubicación en primer plano | Coordenadas, dirección, brújula y enlace a Mapas |
| Sensores | `expo-sensors` | Sin permiso en tiempo de ejecución | Acelerómetro, giroscopio, magnetómetro y nivel visual |
| Biometría | `expo-local-authentication`, `expo-secure-store` | Según el sistema | Autenticación local y bóveda de notas cifrada |
| Extras | Expo Battery, Network, Haptics, Speech, Brightness, Clipboard, Notifications, Device y Pedometer | Según la función | Estado del dispositivo, voz, brillo, portapapeles, pasos y recordatorio local |

## APK con EAS

El perfil `preview` genera un APK instalable:

```sh
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

El APK se descarga desde la página del build de Expo cuando termina. Face ID en iOS requiere un build propio; Expo Go de iOS no lo incluye. Las notificaciones locales y el brillo también se deben validar en el APK, porque Expo Go limita algunas funciones nativas.

## Configuración y permisos

Identificadores fijos: `com.damac.lab` y `damaclab`. La app solo solicita ubicación mientras está en uso; no implementa seguimiento en segundo plano. Las fotos se guardan únicamente luego de tocar “Guardar en galería”. El código no requiere claves de API ni backend.

## Estado de verificación

- Expo SDK `58.0.17` (tag `latest` consultado al crear el proyecto).
- `npx expo install --check` y `npx tsc --noEmit` son los chequeos locales de dependencias y tipos.
- Para validar comportamiento real de cámara, GPS, biometría y APK hace falta instalarlo en un dispositivo Android. No se incluye un enlace de descarga hasta completar un build de EAS.
