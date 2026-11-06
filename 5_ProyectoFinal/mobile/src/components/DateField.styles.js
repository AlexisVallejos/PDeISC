import { StyleSheet } from 'react-native';
import { colors, createStyles, font, radius, spacing } from '../theme';

/** Estilos compartidos por DateField (nativo) y DateField.web. */
export const dateFieldStyles = createStyles(() => StyleSheet.create({
  wrap: { gap: 6, flexGrow: 1, flexBasis: 160 },
  label: { color: colors.muted, fontSize: font.sm, fontWeight: '500', marginLeft: spacing.xs },
  input: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: colors.fill,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: spacing.lg,
  },
  inputError: { borderColor: colors.danger },
  value: { color: colors.text, fontSize: font.body, flexShrink: 1 },
  placeholder: { color: colors.muted },
  error: { color: colors.danger, fontSize: font.xs, marginLeft: spacing.xs },
  hint: { color: colors.muted, fontSize: font.xs, marginLeft: spacing.xs },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingBottom: spacing.xl, paddingHorizontal: spacing.md },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md, paddingHorizontal: spacing.sm },
  cancel: { color: colors.muted, fontSize: font.md },
  done: { color: colors.primary, fontSize: font.md, fontWeight: '700' },
}));
