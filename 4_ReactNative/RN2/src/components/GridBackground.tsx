import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

interface GridBackgroundProps {
  color: string;
  cell?: number;
}

/** Cuadrícula industrial de fondo, dibujada con líneas de 1px. */
export function GridBackground({ color, cell = 32 }: GridBackgroundProps) {
  const [box, setBox] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== box.width || height !== box.height) setBox({ width, height });
  };

  const cols = Math.ceil(box.width / cell);
  const rows = Math.ceil(box.height / cell);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} onLayout={onLayout}>
      {Array.from({ length: cols }, (_, i) => (
        <View key={`c${i}`} style={[styles.v, { left: i * cell, backgroundColor: color }]} />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <View key={`r${i}`} style={[styles.h, { top: i * cell, backgroundColor: color }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  v: { position: 'absolute', top: 0, bottom: 0, width: StyleSheet.hairlineWidth },
  h: { position: 'absolute', left: 0, right: 0, height: StyleSheet.hairlineWidth },
});
