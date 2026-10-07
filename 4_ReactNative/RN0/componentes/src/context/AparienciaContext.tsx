import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { buscarPaleta, PALETA_INICIAL, type Paleta, type PaletaId } from '../paletas';

export type Modo = 'sistema' | 'claro' | 'oscuro';

const CLAVE = 'rn0-componentes:apariencia';

interface AparienciaContextValue {
  paleta: Paleta;
  modo: Modo;
  elegirPaleta: (id: PaletaId) => void;
  elegirModo: (modo: Modo) => void;
}

const AparienciaContext = createContext<AparienciaContextValue | undefined>(undefined);

/** Color de acento y modo (sistema/claro/oscuro). Se recuerdan entre aperturas (AsyncStorage; en la web, localStorage). */
export function AparienciaProvider({ children }: { children: ReactNode }) {
  const [paletaId, setPaletaId] = useState<PaletaId>(PALETA_INICIAL);
  const [modo, setModo] = useState<Modo>('sistema');

  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then((texto) => {
        if (!texto) return;
        const guardado = JSON.parse(texto) as { paleta?: string; modo?: Modo };
        setPaletaId(buscarPaleta(guardado.paleta).id);
        if (guardado.modo === 'claro' || guardado.modo === 'oscuro' || guardado.modo === 'sistema') setModo(guardado.modo);
      })
      .catch(() => {});
  }, []);

  const value = useMemo<AparienciaContextValue>(() => {
    const guardar = (paleta: PaletaId, m: Modo) => AsyncStorage.setItem(CLAVE, JSON.stringify({ paleta, modo: m })).catch(() => {});
    return {
      paleta: buscarPaleta(paletaId),
      modo,
      elegirPaleta: (id) => {
        setPaletaId(id);
        guardar(id, modo);
      },
      elegirModo: (m) => {
        setModo(m);
        guardar(paletaId, m);
      },
    };
  }, [paletaId, modo]);

  return <AparienciaContext.Provider value={value}>{children}</AparienciaContext.Provider>;
}

export function useApariencia(): AparienciaContextValue {
  const ctx = useContext(AparienciaContext);
  if (!ctx) throw new Error('useApariencia debe usarse dentro de <AparienciaProvider>');
  return ctx;
}
