import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';
import { buscarPaleta, PALETA_INICIAL, type Paleta, type PaletaId } from '../paletas';
import type { Fuente } from '../theme';

export type Modo = 'sistema' | 'claro' | 'oscuro';
export type TamañoSaludo = 'chico' | 'mediano' | 'grande';
export type PesoSaludo = 'regular' | 'negrita' | 'black';
export type AlineacionSaludo = 'left' | 'center' | 'right';

/** El "Hola, mundo" que se edita en Estilos y se muestra en Inicio. */
export interface Saludo {
  texto: string;
  tamaño: TamañoSaludo;
  peso: PesoSaludo;
  alineacion: AlineacionSaludo;
}

export const SALUDO_INICIAL: Saludo = { texto: 'Hola, mundo.', tamaño: 'grande', peso: 'black', alineacion: 'left' };

export type PesoTexto = 'regular' | 'negrita' | 'black';

/** Todo lo que se edita en Estilos > Tipografía, Formas (cartas) y Profundidad. */
export interface Diseño {
  fuente: Fuente;
  pesoTexto: PesoTexto;
  /** Tamaño del título de muestra, en pt. */
  tamañoTexto: number;
  /** Espaciado entre letras, en pt. */
  tracking: number;
  /** Interlineado, en % del tamaño. */
  interlineado: number;
  /** Radio de las esquinas de las cartas, en pt. */
  radioCartas: number;
  /** Grosor del borde de las cartas, en pt (0 = sin borde). */
  bordeCartas: number;
  /** Elevación (sombra) de las cartas, de 0 a 40. */
  elevacion: number;
  /** Separación entre las capas de la demo de profundidad, en pt. */
  separacion: number;
}

export const DISEÑO_INICIAL: Diseño = {
  fuente: 'sistema',
  pesoTexto: 'negrita',
  tamañoTexto: 22,
  tracking: 0,
  interlineado: 130,
  radioCartas: 22,
  bordeCartas: 1,
  elevacion: 6,
  separacion: 16,
};

/** Valores compartidos: las cartas los leen en el hilo de UI, así siguen al dedo sin re-render. */
export interface ValoresDiseño {
  tamañoTexto: SharedValue<number>;
  tracking: SharedValue<number>;
  interlineado: SharedValue<number>;
  radioCartas: SharedValue<number>;
  bordeCartas: SharedValue<number>;
  elevacion: SharedValue<number>;
  separacion: SharedValue<number>;
}

interface Guardado {
  paleta: PaletaId;
  modo: Modo;
  saludo: Saludo;
  diseño: Diseño;
}

interface AparienciaContextValue {
  paleta: Paleta;
  modo: Modo;
  saludo: Saludo;
  elegirPaleta: (id: PaletaId) => void;
  elegirModo: (modo: Modo) => void;
  editarSaludo: (cambios: Partial<Saludo>) => void;
  diseño: Diseño;
  valores: ValoresDiseño;
  /** Guarda cambios del diseño. Los números también deben llevarse a sus valores compartidos (ver `llevarValores`). */
  editarDiseño: (cambios: Partial<Diseño>) => void;
}

const CLAVE = 'rn0-hola-mundo:apariencia';
const AparienciaContext = createContext<AparienciaContextValue | undefined>(undefined);

/**
 * Preferencias de toda la app: color de acento, modo (sistema/claro/oscuro) y el saludo editable.
 * Se recuerdan entre aperturas (AsyncStorage; en la web, localStorage).
 */
export function AparienciaProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Guardado>({
    paleta: PALETA_INICIAL,
    modo: 'sistema',
    saludo: SALUDO_INICIAL,
    diseño: DISEÑO_INICIAL,
  });
  const valores: ValoresDiseño = {
    tamañoTexto: useSharedValue(DISEÑO_INICIAL.tamañoTexto),
    tracking: useSharedValue(DISEÑO_INICIAL.tracking),
    interlineado: useSharedValue(DISEÑO_INICIAL.interlineado),
    radioCartas: useSharedValue(DISEÑO_INICIAL.radioCartas),
    bordeCartas: useSharedValue(DISEÑO_INICIAL.bordeCartas),
    elevacion: useSharedValue(DISEÑO_INICIAL.elevacion),
    separacion: useSharedValue(DISEÑO_INICIAL.separacion),
  };

  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then((texto) => {
        if (!texto) return;
        const g = JSON.parse(texto) as Partial<Guardado>;
        const diseño = { ...DISEÑO_INICIAL, ...g.diseño };
        // Lo guardado también va a los valores compartidos, para que las cartas arranquen con su forma.
        (Object.keys(valores) as (keyof ValoresDiseño)[]).forEach((k) => valores[k].set(diseño[k]));
        setEstado((actual) => ({
          paleta: buscarPaleta(g.paleta).id,
          modo: g.modo === 'claro' || g.modo === 'oscuro' ? g.modo : 'sistema',
          saludo: { ...actual.saludo, ...g.saludo },
          diseño,
        }));
      })
      .catch(() => {});
  }, []);

  const value = useMemo<AparienciaContextValue>(() => {
    // Siempre a partir del estado más reciente: escribir rápido en el saludo no pierde letras.
    const actualizar = (cambio: (actual: Guardado) => Partial<Guardado>) =>
      setEstado((actual) => {
        const nuevo = { ...actual, ...cambio(actual) };
        AsyncStorage.setItem(CLAVE, JSON.stringify(nuevo)).catch(() => {});
        return nuevo;
      });
    return {
      paleta: buscarPaleta(estado.paleta),
      modo: estado.modo,
      saludo: estado.saludo,
      elegirPaleta: (paleta) => actualizar(() => ({ paleta })),
      elegirModo: (modo) => actualizar(() => ({ modo })),
      editarSaludo: (cambios) => actualizar((actual) => ({ saludo: { ...actual.saludo, ...cambios } })),
      diseño: estado.diseño,
      valores,
      editarDiseño: (cambios) => actualizar((actual) => ({ diseño: { ...actual.diseño, ...cambios } })),
    };
    // Los valores compartidos son estables: no hace falta volver a crear el objeto por ellos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  return <AparienciaContext.Provider value={value}>{children}</AparienciaContext.Provider>;
}

export function useApariencia(): AparienciaContextValue {
  const ctx = useContext(AparienciaContext);
  if (!ctx) throw new Error('useApariencia debe usarse dentro de <AparienciaProvider>');
  return ctx;
}

/** Separa el saludo en "todo menos la última palabra" + "última palabra" (que va en el color de acento). */
export function partirSaludo(texto: string): [string, string] {
  const limpio = texto.trim() || SALUDO_INICIAL.texto;
  const corte = limpio.lastIndexOf(' ');
  return corte === -1 ? ['', limpio] : [limpio.slice(0, corte), limpio.slice(corte + 1)];
}
