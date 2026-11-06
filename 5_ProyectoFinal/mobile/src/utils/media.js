import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

/** ~6 MB de imagen: el servidor rechaza más (las fotos viajan en base64). */
const MAX_DATA_URL = 9 * 1024 * 1024;

/**
 * Saca una foto o la elige de la galería y la devuelve como data URL lista para la IA.
 * null si el usuario cancela. Lanza un Error con mensaje en castellano si falta el permiso.
 */
export async function pickImage(source = 'camera') {
  const useCamera = source === 'camera' && Platform.OS !== 'web';
  if (useCamera) {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) throw new Error('Necesitamos permiso para usar la cámara. Activalo en los ajustes del teléfono.');
  }
  const options = { mediaTypes: ['images'], quality: 0.5, base64: true, allowsEditing: false, exif: false };
  const result = useCamera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
  if (result.canceled || !result.assets?.length) return null;
  const asset = result.assets[0];
  const dataUrl = asset.uri?.startsWith('data:') ? asset.uri : `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`;
  if (dataUrl.length > MAX_DATA_URL) throw new Error('La foto es muy pesada. Probá con otra o sacala de más cerca.');
  return dataUrl;
}

/** Lado más largo de las fotos que se suben (catálogo): suficiente para verse bien y liviano. */
const UPLOAD_MAX_SIDE = 1280;

/**
 * Elige un archivo de imagen (galería en el celular, selector de archivos en la web) o saca una
 * foto, la achica a 1280 px y la devuelve como data URL JPEG lista para subir. null si se cancela.
 */
export async function pickImageForUpload(source = 'library') {
  const useCamera = source === 'camera' && Platform.OS !== 'web';
  if (useCamera) {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) throw new Error('Necesitamos permiso para usar la cámara. Activalo en los ajustes del teléfono.');
  }
  const options = { mediaTypes: ['images'], quality: 1, allowsEditing: Platform.OS !== 'web', aspect: [4, 3], exif: false };
  const result = useCamera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
  if (result.canceled || !result.assets?.length) return null;
  const asset = result.assets[0];
  if (asset.mimeType && !/^image\/(jpeg|png|webp|heic|heif)$/.test(asset.mimeType)) {
    throw new Error('Elegí una imagen JPG, PNG o WEBP.');
  }

  const context = ImageManipulator.manipulate(asset.uri);
  const longest = Math.max(asset.width || 0, asset.height || 0);
  if (longest > UPLOAD_MAX_SIDE) {
    context.resize(asset.width >= asset.height ? { width: UPLOAD_MAX_SIDE } : { height: UPLOAD_MAX_SIDE });
  }
  const image = await context.renderAsync();
  const saved = await image.saveAsync({ compress: 0.75, format: SaveFormat.JPEG, base64: true });
  if (!saved.base64) throw new Error('No se pudo leer la imagen. Probá con otra.');
  return `data:image/jpeg;base64,${saved.base64}`;
}
