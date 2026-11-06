import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { uploadsApi } from '../api/endpoints';
import { colors, continuous, createStyles, font, radius, spacing, useTheme } from '../theme';
import { pickImageForUpload } from '../utils/media';
import { Button } from './Button';

/**
 * Foto elegida desde un archivo (galería o selector de archivos en la web) o sacada con la cámara.
 * Apenas se elige, se achica y se sube al servidor; `onChange` recibe la URL pública o null al quitarla.
 */
export function ImageField({ label = 'Imagen', value, onChange, error }) {
  useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [broken, setBroken] = useState(false);

  const choose = async (source) => {
    setUploadError(null);
    try {
      const dataUrl = await pickImageForUpload(source);
      if (!dataUrl) return; // canceló
      setUploading(true);
      const { url } = await uploadsApi.image(dataUrl);
      setBroken(false);
      onChange(url);
    } catch (err) {
      setUploadError(err.message || 'No se pudo subir la imagen. Probá de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const shownError = uploadError || error;
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.preview, continuous, shownError && styles.previewError]}>
        {value && !broken ? (
          <Image source={{ uri: value }} style={styles.image} resizeMode="cover" onError={() => setBroken(true)} accessibilityLabel={label} />
        ) : (
          <View style={styles.empty}>
            <Ionicons name={broken ? 'alert-circle-outline' : 'image-outline'} size={34} color={colors.muted} />
            <Text style={styles.emptyText}>{broken ? 'No se pudo cargar la imagen' : 'Sin imagen'}</Text>
          </View>
        )}
        {uploading ? (
          <View style={styles.overlay}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.overlayText}>Subiendo…</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.actions}>
        <Button
          title={value ? 'Cambiar imagen' : Platform.OS === 'web' ? 'Elegir archivo' : 'Elegir de la galería'}
          icon="folder-open-outline"
          variant="tinted"
          small
          onPress={() => choose('library')}
          disabled={uploading}
        />
        {Platform.OS !== 'web' ? (
          <Button title="Sacar foto" icon="camera-outline" variant="tinted" small onPress={() => choose('camera')} disabled={uploading} />
        ) : null}
        {value ? (
          <Button title="Quitar" icon="trash-outline" variant="danger" small onPress={() => onChange(null)} disabled={uploading} />
        ) : null}
      </View>
      {shownError ? <Text style={styles.error}>{shownError}</Text> : <Text style={styles.hint}>JPG, PNG o WEBP. Se achica sola antes de subirse.</Text>}
    </View>
  );
}

const styles = createStyles(() => StyleSheet.create({
  wrap: { gap: spacing.sm },
  label: { color: colors.muted, fontSize: font.sm, fontWeight: '500', marginLeft: spacing.xs },
  preview: {
    width: '100%',
    maxWidth: 420,
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.fill,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  previewError: { borderColor: colors.danger },
  image: { width: '100%', height: '100%' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  emptyText: { color: colors.muted, fontSize: font.sm },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  overlayText: { color: '#fff', fontSize: font.sm, fontWeight: '600' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  error: { color: colors.danger, fontSize: font.xs, marginLeft: spacing.xs },
  hint: { color: colors.muted, fontSize: font.xs, marginLeft: spacing.xs },
}));
