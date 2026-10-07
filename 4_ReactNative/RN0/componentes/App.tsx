import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AparienciaProvider } from './src/context/AparienciaContext';
import { CatalogoScreen } from './src/screens/CatalogoScreen';
import { DetalleScreen } from './src/screens/DetalleScreen';
import { useTheme } from './src/theme';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AparienciaProvider>
          <Navegacion />
        </AparienciaProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/** Navegación con el tema actual (modo + acento elegidos en Apariencia). */
function Navegacion() {
  const c = useTheme();
  const reduceMotion = useReducedMotion();
  const base = c.scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: { ...base.colors, primary: c.tint, background: c.background, card: c.card, text: c.label, border: c.separator },
  };

  return (
    <NavigationContainer theme={navTheme}>
      {/* Hora y batería según el modo de la app (puede no coincidir con el del sistema) */}
      <StatusBar style={c.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack.Navigator
        initialRouteName="Catalogo"
        screenOptions={{
          headerShown: false,
          // Transición nativa de la plataforma (push con gesto de borde en iOS); con "reducir movimiento", fundido.
          animation: reduceMotion ? 'fade' : 'default',
          contentStyle: { backgroundColor: c.background },
        }}
      >
        <Stack.Screen name="Catalogo" component={CatalogoScreen} options={{ title: 'Componentes de React Native' }} />
        <Stack.Screen name="Detalle" component={DetalleScreen} options={({ route }) => ({ title: `Componente · ${route.params.id}` })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
