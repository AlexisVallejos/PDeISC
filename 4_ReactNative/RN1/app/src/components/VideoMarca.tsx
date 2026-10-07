import { useFocusEffect } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { colors } from '../theme';

const VIDEO = require('../../assets/video/damac-login.mp4');
const POSTER = require('../../assets/video/damac-login-poster.jpg');

/**
 * Video de marca del login (960×1080, 36 s, sin audio, en bucle).
 * - Mudo y con mezcla de audio "mixWithOthers": no corta la música del usuario.
 * - El póster queda debajo: se ve al instante y mientras el video carga.
 * - Se pausa cuando la pantalla pierde el foco (por ejemplo, al entrar a Bienvenida).
 * - Con "reducir movimiento" se muestra solo el póster, sin reproducir.
 * - contentFit "cover": llena el panel; el logo está en el centro, así que el recorte lo respeta.
 */
export function VideoMarca({ style }: { style?: StyleProp<ViewStyle> }) {
  const reducirMovimiento = useReducedMotion();

  const player = useVideoPlayer(VIDEO, (p) => {
    p.loop = true;
    p.muted = true;
    p.volume = 0;
    p.audioMixingMode = 'mixWithOthers';
  });

  useFocusEffect(
    useCallback(() => {
      if (reducirMovimiento) {
        player.pause();
        return;
      }
      player.play();
      return () => player.pause();
    }, [player, reducirMovimiento]),
  );

  return (
    <View
      style={[styles.marco, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="DAMAC. Accesorios para aberturas de aluminio y PVC."
    >
      <Image source={POSTER} style={styles.poster} />
      {!reducirMovimiento && (
        <VideoView
          player={player}
          nativeControls={false}
          contentFit="cover"
          allowsPictureInPicture={false}
          style={styles.video}
          pointerEvents="none"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // En web, expo-video pinta un <video> con este estilo tal cual: sin width/height al 100% queda en su tamaño
  // natural (960×1080) y "cover" no tiene efecto. En iOS y Android es inofensivo.
  video: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' },
  marco: { overflow: 'hidden', backgroundColor: colors.carbonDeep },
  poster: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%', resizeMode: 'cover' },
});
