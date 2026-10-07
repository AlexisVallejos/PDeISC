import { useMemo } from 'react';
import { useColorScheme, type TextStyle } from 'react-native';
import { useApariencia, type Saludo } from './context/AparienciaContext';
import { conAlfa, type Paleta } from './paletas';
import { FUENTES, type Fuente, type as t } from './theme';

/**
 * Colores según el modo (claro u oscuro) y el color de acento elegido.
 * Inicio es siempre sobrio (fondo liso); Estilos es expresivo (degradado + vidrio) en los dos modos.
 * En claro el acento es el tono "claro" con texto blanco; en oscuro, el "brillante" con texto negro.
 */
export function useTema() {
  const sistema = useColorScheme();
  const { paleta, modo } = useApariencia();
  const oscuro = modo === 'sistema' ? sistema === 'dark' : modo === 'oscuro';
  return useMemo(() => crearTema(paleta, oscuro), [paleta, oscuro]);
}

export type Tema = ReturnType<typeof crearTema>;

function crearTema(p: Paleta, oscuro: boolean) {
  return {
    oscuro,
    paleta: p,
    acento: oscuro ? p.brillante : p.claro,
    sobreAcento: oscuro ? '#000000' : '#FFFFFF',

    // Inicio: liso
    fondo: oscuro ? '#000000' : '#FFFFFF',
    texto: oscuro ? '#FFFFFF' : '#111113',
    texto2: oscuro ? 'rgba(235, 235, 245, 0.66)' : 'rgba(60, 60, 67, 0.66)',
    texto3: oscuro ? 'rgba(235, 235, 245, 0.38)' : 'rgba(60, 60, 67, 0.38)',
    separador: oscuro ? 'rgba(84, 84, 88, 0.6)' : 'rgba(60, 60, 67, 0.18)',
    relleno: oscuro ? 'rgba(118, 118, 128, 0.24)' : 'rgba(120, 120, 128, 0.12)',

    // Estilos: degradado + tarjetas de vidrio
    degradado: (oscuro ? [p.profundo, p.noche] : [conAlfa(p.brillante, 0.32), '#FFFFFF']) as [string, string],
    brillo: conAlfa(p.brillante, oscuro ? 0.26 : 0.3),
    tarjeta: oscuro ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.88)',
    tarjetaBorde: oscuro ? 'rgba(255, 255, 255, 0.12)' : conAlfa(p.claro, 0.16),
    barraEstilos: oscuro ? p.noche : '#FFFFFF',
  };
}

/** Estilo de texto del saludo según lo elegido en Estilos. */
export function estiloSaludo(s: Saludo, escala = 1, fuente: Fuente = 'sistema'): TextStyle {
  const tamaños = { chico: 34, mediano: 46, grande: 56 } as const;
  const pesos = { regular: '400', negrita: '700', black: '800' } as const;
  const size = Math.round(tamaños[s.tamaño] * escala);
  return {
    ...t.display,
    fontFamily: FUENTES[fuente].familia,
    fontSize: size,
    lineHeight: Math.round(size * 1.08),
    letterSpacing: -size * 0.035,
    fontWeight: pesos[s.peso],
    textAlign: s.alineacion,
  };
}

/** Colores de los controles (segmentados y deslizadores) según el tema. */
export function coloresControles(tema: Tema) {
  return {
    seg: {
      pista: tema.relleno,
      activo: tema.oscuro ? 'rgba(255, 255, 255, 0.16)' : '#FFFFFF',
      texto: tema.texto2,
      textoActivo: tema.texto,
    },
    desl: { pista: tema.relleno, relleno: tema.acento, texto: tema.texto, texto2: tema.texto2 },
  };
}
