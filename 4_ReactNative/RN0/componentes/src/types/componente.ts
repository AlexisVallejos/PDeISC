import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type CategoriaId = 'basicos' | 'interaccion' | 'listas' | 'avisos' | 'pantalla' | 'plataforma' | 'apis';

export interface Categoria {
  id: CategoriaId;
  titulo: string;
  descripcion: string;
}

export interface PropClave {
  nombre: string;
  descripcion: string;
}

export interface Componente {
  /** Identificador estable (se usa en la ruta y para buscar la demo). */
  id: string;
  /** Nombre exacto como se importa de 'react-native'. */
  nombre: string;
  categoria: CategoriaId;
  /** "componente" se renderiza como <Etiqueta />; "api" es un módulo o hook. */
  tipo: 'componente' | 'api';
  icono: IconName;
  /** Una línea: qué es. */
  resumen: string;
  /** Para qué se usa y cuándo conviene. */
  paraQue: string;
  props: PropClave[];
  codigo: string;
  /** Si solo existe en una plataforma. */
  plataforma?: 'android' | 'ios';
  /** Aviso de estado (por ejemplo, componente desaconsejado). */
  aviso?: string;
}
