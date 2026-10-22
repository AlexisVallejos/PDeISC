import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/ThemeContext';
import type { RootStackParamList } from './src/navigation/types';
import { InicioScreen } from './src/screens/InicioScreen';
import { ToolScreen } from './src/screens/ToolScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
function Navigation() {
  const { mode, palette } = useTheme();
  const base = mode === 'dark' ? DarkTheme : DefaultTheme;
  return <><StatusBar style={mode === 'dark' ? 'light' : 'dark'} /><NavigationContainer theme={{ ...base, colors: { ...base.colors, primary: '#E30614', background: palette.background, card: palette.surface, text: palette.label, border: palette.separator } }}>
    <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.background } }}>
      <Stack.Screen name="Inicio" component={InicioScreen} />
      {(['Camara', 'Lector', 'Ubicacion', 'Sensores', 'Biometria', 'Extras'] as const).map(name => <Stack.Screen key={name} name={name} component={ToolScreen} />)}
    </Stack.Navigator>
  </NavigationContainer></>;
}
export default function App() { return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><ThemeProvider><Navigation /></ThemeProvider></SafeAreaProvider></GestureHandlerRootView>; }
