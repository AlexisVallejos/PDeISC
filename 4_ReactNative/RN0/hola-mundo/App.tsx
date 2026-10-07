import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AparienciaProvider } from './src/context/AparienciaContext';
import { conAlfa } from './src/paletas';
import { EstilosScreen } from './src/screens/EstilosScreen';
import { InicioScreen } from './src/screens/InicioScreen';
import { useTema } from './src/tema';
import { font } from './src/theme';
import type { TabParamList } from './src/types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

// En la web la barra por defecto (49 px) corta la etiqueta con la fuente del sistema; en iOS/Android queda la nativa.
const alturaWeb = Platform.OS === 'web' ? { height: 60, paddingTop: 4, paddingBottom: 6 } : null;

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AparienciaProvider>
          <NavigationContainer>
            <Pestanas />
          </NavigationContainer>
        </AparienciaProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/** Las dos pestañas. La barra toma el color y el modo elegidos y cambia de estilo según la pestaña activa. */
function Pestanas() {
  const tema = useTema();
  const { paleta } = tema;

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: false,
        // Las pestañas son pares, no una jerarquía: el cambio es instantáneo, sin deslizar.
        animation: 'none',
        tabBarLabelStyle: { fontFamily: font, fontSize: 11, lineHeight: 14, fontWeight: '600' },
      }}
    >
      {/* Pestaña 1: clara y mínima */}
      <Tab.Screen
        name="Inicio"
        component={InicioScreen}
        options={{
          title: 'Hola Mundo',
          tabBarLabel: 'Inicio',
          tabBarActiveTintColor: tema.acento,
          tabBarInactiveTintColor: tema.texto3,
          tabBarStyle: { backgroundColor: tema.oscuro ? '#0B0B0C' : '#FFFFFF', borderTopColor: tema.separador, ...alturaWeb },
          tabBarIcon: ({ color, focused, size }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />,
        }}
      />
      {/* Pestaña 2: la barra también cambia de estilo (teñida con el color elegido) */}
      <Tab.Screen
        name="Estilos"
        component={EstilosScreen}
        options={{
          title: 'Estilos',
          tabBarActiveTintColor: tema.acento,
          tabBarInactiveTintColor: tema.texto3,
          tabBarStyle: {
            backgroundColor: tema.barraEstilos,
            borderTopColor: conAlfa(paleta.brillante, tema.oscuro ? 0.18 : 0.3),
            ...alturaWeb,
          },
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'color-palette' : 'color-palette-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
