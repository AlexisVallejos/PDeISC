import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type TabParamList = {
  Inicio: undefined;
  Estilos: undefined;
};

export type InicioScreenProps = BottomTabScreenProps<TabParamList, 'Inicio'>;
export type EstilosScreenProps = BottomTabScreenProps<TabParamList, 'Estilos'>;
