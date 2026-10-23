import { registerRootComponent } from 'expo';

import App from './App';

// Punto de entrada indicado por "main": "index.ts" en package.json.
// Expo Go descarga este módulo desde Metro cuando se abre la URL del QR.
// registerRootComponent registra App como raíz y prepara el entorno nativo de Expo.
// La conexión por Wi-Fi y el QR los gestiona `expo start --lan`; no se programa un socket aquí.
registerRootComponent(App);
