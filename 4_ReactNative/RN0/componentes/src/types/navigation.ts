import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Catalogo: undefined;
  Detalle: { id: string };
};

export type CatalogoScreenProps = NativeStackScreenProps<RootStackParamList, 'Catalogo'>;
export type DetalleScreenProps = NativeStackScreenProps<RootStackParamList, 'Detalle'>;
