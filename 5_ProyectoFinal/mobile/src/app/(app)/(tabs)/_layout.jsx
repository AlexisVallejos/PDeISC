import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import { Platform, StyleSheet } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useResponsive } from '../../../hooks/useResponsive';
import { colors, createStyles, font, MAX_CONTENT_WIDTH, spacing, tracking, useTheme } from '../../../theme';

/** Como en iOS: ícono de contorno en reposo y relleno en la pestaña activa. */
const icon = (name) =>
  function TabBarIcon({ color, size, focused }) {
    return <Ionicons name={focused ? name : `${name}-outline`} size={size} color={color} />;
  };

/**
 * Pestañas según el rol:
 *  - Atleta:        Inicio · Diario · Entrenos · Progreso · Perfil
 *  - Entrenador:    Atletas · Catálogo · Perfil
 *  - Administrador: Panel · Usuarios · Catálogo · Perfil
 * La barra va siempre abajo; en pantallas anchas (tablet, web) muestra el ícono al lado del texto.
 */
export default function TabsLayout() {
  useTheme();
  const { user } = useAuth();
  const { width } = useResponsive();
  const wide = width >= 700;
  // El título grande se alinea con el contenido, que está centrado con ancho máximo
  const titleInset = Math.max(0, (width - MAX_CONTENT_WIDTH) / 2);
  const role = user?.role;
  const homeTitle = role === 'admin' ? 'Panel' : role === 'coach' ? 'Mis atletas' : 'Inicio';
  const homeIcon = role === 'admin' ? 'speedometer' : role === 'coach' ? 'people' : 'home';

  return (
    <Tabs
      screenOptions={{
        // Título grande alineado a la izquierda, como los "large titles" de iOS
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerTintColor: colors.text,
        headerTitleStyle: { fontSize: font.display - 2, fontWeight: '700', letterSpacing: tracking.display },
        headerTitleContainerStyle: { marginLeft: spacing.lg + titleInset },
        tabBarPosition: 'bottom',
        tabBarLabelPosition: wide ? 'beside-icon' : 'below-icon',
        tabBarStyle: [styles.tabBar, wide && { paddingHorizontal: titleInset + spacing.lg }],
        tabBarItemStyle: wide ? styles.wideItem : undefined,
        tabBarLabelStyle: wide ? styles.wideLabel : styles.tabLabel,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarActiveBackgroundColor: wide ? colors.primarySoft : undefined,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: homeTitle, tabBarIcon: icon(homeIcon) }} />

      <Tabs.Protected guard={role === 'athlete'}>
        <Tabs.Screen name="diary" options={{ title: 'Diario', tabBarIcon: icon('restaurant') }} />
        <Tabs.Screen name="workouts" options={{ title: 'Entrenos', tabBarIcon: icon('barbell') }} />
        <Tabs.Screen name="progress" options={{ title: 'Progreso', tabBarIcon: icon('stats-chart') }} />
      </Tabs.Protected>

      <Tabs.Protected guard={role === 'admin'}>
        <Tabs.Screen name="users" options={{ title: 'Usuarios', tabBarIcon: icon('person-add') }} />
      </Tabs.Protected>

      <Tabs.Protected guard={role === 'coach' || role === 'admin'}>
        <Tabs.Screen name="catalog" options={{ title: 'Catálogo', tabBarIcon: icon('library') }} />
      </Tabs.Protected>

      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: icon('person-circle') }} />
    </Tabs>
  );
}

const styles = createStyles(() => StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBar,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    // En web no hay margen seguro inferior: sin esto las etiquetas quedan pegadas al borde
    ...(Platform.OS === 'web' ? { height: 60, paddingTop: 4, paddingBottom: 8 } : null),
  },
  tabLabel: { fontSize: 10, fontWeight: '500' },
  // Pantallas anchas: pastillas con ícono y texto, repartidas a lo ancho del contenido
  wideItem: { borderRadius: 12, marginHorizontal: 4, marginVertical: 2 },
  wideLabel: { fontSize: font.md, fontWeight: '600', marginLeft: 8 },
}));
