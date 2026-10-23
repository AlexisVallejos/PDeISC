import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Usuario } from './usuario';

export type RootStackParamList = {
  Login: undefined;
  Bienvenida: { usuario: Usuario };
  Recuperar: { identificador?: string } | undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RecuperarScreenProps = NativeStackScreenProps<RootStackParamList, 'Recuperar'>;
export type BienvenidaScreenProps = NativeStackScreenProps<RootStackParamList, 'Bienvenida'>;
