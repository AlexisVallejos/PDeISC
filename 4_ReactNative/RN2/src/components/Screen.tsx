import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import { type as t, colors, space } from '../theme';
import { ThemeToggle } from './ThemeToggle';
import { PressableScale } from './PressableScale';
import { Ionicons } from '@expo/vector-icons';

export function Screen({ title, children, back = true }: { title: string; children: ReactNode; back?: boolean }) {
 const { palette } = useTheme(); const nav = useNavigation();
 return <View style={[s.root, { backgroundColor: palette.background }]}><View style={s.header}>{back ? <PressableScale style={[s.back,{backgroundColor:palette.surface,borderColor:palette.controlBorder}]} accessibilityRole="button" accessibilityLabel="Volver" onPress={() => nav.goBack()}><Ionicons name="chevron-back" size={23} color={palette.label}/></PressableScale> : <View style={{width:44}}/>}<Text style={[t.headline,{color:palette.label,flex:1}]} numberOfLines={1}>{title}</Text><ThemeToggle /></View><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">{children}</ScrollView></View>;
}
export function SectionTitle({ children }: { children: string }) { const {palette}=useTheme(); return <Text style={[t.eyebrow,{color:palette.secondaryLabel,marginTop:space.lg,marginBottom:space.sm}]}>{children}</Text>; }
export function Card({ children, style }: { children: ReactNode; style?: object }) { const {palette}=useTheme(); return <View style={[s.card,{backgroundColor:palette.surface,borderColor:palette.controlBorder},style]}>{children}</View>; }
export function Label({children}: {children:string}) {const {palette}=useTheme();return <Text style={[t.footnote,{color:palette.secondaryLabel}]}>{children}</Text>}
export const brand = colors.primary;
const s=StyleSheet.create({root:{flex:1},header:{height:60,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:18},back:{width:44,height:44,borderRadius:22,borderWidth:1,alignItems:'center',justifyContent:'center'},content:{paddingHorizontal:18,paddingTop:space.sm,paddingBottom:40},card:{borderRadius:18,borderWidth:1,padding:16,marginBottom:12},});
