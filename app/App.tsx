import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BienvenidaScreen } from './src/screens/BienvenidaScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { colors } from './src/theme';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const reduceMotion = useReducedMotion();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              // Transición nativa de la plataforma; con "reducir movimiento", un fundido.
              animation: reduceMotion ? 'fade' : 'default',
              contentStyle: { backgroundColor: colors.carbonDeep },
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'DAMAC — Ingreso' }} />
            <Stack.Screen
              name="Bienvenida"
              component={BienvenidaScreen}
              options={{ title: 'DAMAC — Bienvenida', gestureEnabled: false, contentStyle: { backgroundColor: colors.groupedBackground } }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
