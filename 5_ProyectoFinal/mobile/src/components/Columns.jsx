import { Children } from 'react';
import { StyleSheet, View } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { createStyles, spacing, useTheme } from '../theme';

/**
 * Dos columnas en pantallas anchas (PC, tablet horizontal); en el celular se apilan.
 * `side` es la columna angosta (resumen, filtros); `children`, la principal.
 */
export function Columns({ side, children, sideWidth = 400 }) {
  useTheme();
  const { width } = useResponsive();
  if (width < 1000) {
    return (
      <>
        {side}
        {children}
      </>
    );
  }
  return (
    <View style={styles.row}>
      <View style={[styles.col, { width: sideWidth }]}>{side}</View>
      <View style={[styles.col, { flex: 1 }]}>{children}</View>
    </View>
  );
}

/** Filas de una lista (ListItem) en dos columnas en la PC; en el celular, una debajo de la otra. */
export function ListColumns({ children }) {
  useTheme();
  const { width } = useResponsive();
  if (width < 1000) return <>{children}</>;
  return (
    <View style={styles.listGrid}>
      {Children.toArray(children).map((child, i) => (
        <View key={i} style={styles.half}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = createStyles(() => StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg },
  col: { gap: spacing.lg, minWidth: 0 },
  listGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.xl },
  half: { width: '48%', flexGrow: 1 },
}));
