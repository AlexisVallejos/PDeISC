import { useFocusEffect } from '@react-navigation/native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useState } from 'react';
import { Image, Platform, StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

const VIDEO = require('../../assets/video/damac-login.mp4');
const POSTER = require('../../assets/video/damac-login-poster.jpg');

// Medidas del video (960×1080). Con "cover" se acepta perder hasta un 10 % por eje; más que eso, "contain".
const SRC_W = 960;
const SRC_H = 1080;
const MIN_VISIBLE = 0.9;
// Fondo del video en los bordes: las barras de "contain" no se notan.
const BORDE = '#202021';

/**
 * Video de marca del login (960×1080, 36 s, sin audio, en bucle).
 * - Se ajusta al panel: "cover" (a pantalla completa, sin barras negras) mientras el recorte sea mínimo;
 *   si la proporción del panel cortaría el contenido, "contain" con barras del color del video.
 * - Mudo y con mezcla de audio "mixWithOthers": no corta la música del usuario.
 * - El póster queda debajo: se ve al instante y mientras el video carga.
 * - Se pausa cuando la pantalla pierde el foco (por ejemplo, al entrar a Bienvenida).
 * - Con "reducir movimiento" se muestra solo el póster, sin reproducir.
 */
export function VideoMarca({ style }: { style?: StyleProp<ViewStyle> }) {
  const reducirMovimiento = useReducedMotion();
  const [panel, setPanel] = useState({ width: 0, height: 0 });

  const player = useVideoPlayer(VIDEO, (p) => {
    p.loop = true;
    p.muted = true;
    p.volume = 0;
    p.audioMixingMode = 'mixWithOthers';
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  useFocusEffect(
    useCallback(() => {
      if (reducirMovimiento) {
        player.pause();
        return;
      }
      const syncPlayback = () => {
        if (Platform.OS === 'web' && document.visibilityState !== 'visible') player.pause();
        else player.play();
      };
      syncPlayback();
      if (Platform.OS === 'web') document.addEventListener('visibilitychange', syncPlayback);
      return () => {
        if (Platform.OS === 'web') document.removeEventListener('visibilitychange', syncPlayback);
        player.pause();
      };
    }, [player, reducirMovimiento]),
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setPanel((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  // Con "cover" se ve panel/escala del video: si se pierde poco, se usa; si no, "contain".
  const escala = panel.width && panel.height ? Math.max(panel.width / SRC_W, panel.height / SRC_H) : 1;
  const cubre =
    panel.width > 0 && panel.width / escala >= SRC_W * MIN_VISIBLE && panel.height / escala >= SRC_H * MIN_VISIBLE;
  const fit = cubre ? 'cover' : 'contain';

  return (
    <View
      style={[styles.marco, style]}
      onLayout={onLayout}
      accessible
      accessibilityRole="image"
      accessibilityLabel="DAMAC. Accesorios para aberturas de aluminio y PVC."
    >
      {!reducirMovimiento && (
        <VideoView
          player={player}
          nativeControls={false}
          contentFit={fit}
          allowsPictureInPicture={false}
          style={styles.video}
        />
      )}
      {(reducirMovimiento || !isPlaying) && <Image source={POSTER} resizeMode={fit} style={styles.poster} />}
    </View>
  );
}

const styles = StyleSheet.create({
  // En web, expo-video pinta un <video> con este estilo tal cual: sin width/height al 100% queda en su tamaño
  // natural (960×1080) y "cover" no tiene efecto. En iOS y Android es inofensivo.
  video: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' },
  marco: { overflow: 'hidden', backgroundColor: BORDE },
  poster: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' },
});
