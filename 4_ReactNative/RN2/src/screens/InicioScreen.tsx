import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import * as LocalAuthentication from 'expo-local-authentication';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { useTheme } from '../ThemeContext';
import { type as t, colors, radius } from '../theme';
import { GridBackground } from '../components/GridBackground';
import { ThemeToggle } from '../components/ThemeToggle';
import { PressableScale } from '../components/PressableScale';
import type { RootStackParamList } from '../navigation/types';

const cards = [
 ['Camara','Cámara','Sacá y compartí fotos.','camera',' #E30614'],['Lector','Códigos','QR y barras al instante.','qr-code','#0A84FF'],['Ubicacion','Ubicación','GPS, brújula y recorrido.','navigate','#34C759'],['Sensores','Sensores','Acelerómetro y giroscopio.','speedometer','#AF52DE'],['Biometria','Biometría','Probá la autenticación local.','finger-print','#FF9F0A'],['Extras','Extras','Batería, voz, red y más.','hardware-chip','#637083'],
] as const;
export function InicioScreen() {
 const {palette}=useTheme(); const nav=useNavigation<NativeStackNavigationProp<RootStackParamList>>(); const reduce=useReducedMotion(); const wide=Dimensions.get('window').width>=700; const [statuses,setStatuses]=useState<Record<string,string>>({});
 useEffect(()=>{let active=true;Promise.allSettled([Camera.getCameraPermissionsAsync(),Location.getForegroundPermissionsAsync(),Accelerometer.isAvailableAsync(),Gyroscope.isAvailableAsync(),LocalAuthentication.hasHardwareAsync().then(async hardware=>hardware&&await LocalAuthentication.isEnrolledAsync())]).then(([camera,location,accel,gyro,bio])=>{if(!active)return;const sensorOk=accel.status==='fulfilled'&&accel.value&&gyro.status==='fulfilled'&&gyro.value;setStatuses({Camara:camera.status==='fulfilled'&&camera.value.granted?'Disponible':'Pedir permiso',Lector:camera.status==='fulfilled'&&camera.value.granted?'Disponible':'Pedir permiso',Ubicacion:location.status==='fulfilled'&&location.value.granted?'Disponible':'Pedir permiso',Sensores:sensorOk?'Disponible':'No disponible',Biometria:bio.status==='fulfilled'&&bio.value?'Disponible':'No disponible',Extras:'Disponible'});});return()=>{active=false;};},[]);
 return <View style={[s.root,{backgroundColor:palette.background}]}><GridBackground color={palette.grid}/><View style={s.top}><Text style={[t.title2,{color:palette.label}]}><Text style={{color:colors.primary}}>D</Text>AMAC <Text style={{fontWeight:'500'}}>Lab</Text></Text><ThemeToggle/></View><View style={s.intro}><Text style={[t.largeTitle,{color:palette.label}]}>Herramientas del dispositivo</Text><Text style={[t.body,{color:palette.secondaryLabel,marginTop:8}]}>Probá la cámara, el GPS, los sensores y más.</Text></View><View style={[s.grid,{maxWidth:wide?960:600}]}>{cards.map(([route,title,desc,icon,accent],i)=>{const status=statuses[route]??'Consultando…';const statusColor=status==='Disponible'?colors.success:status==='Pedir permiso'?colors.primary:palette.secondaryLabel;return <Animated.View key={route} entering={reduce?FadeInDown.duration(200):FadeInDown.delay(i*70).duration(400)} style={{width:wide?'31.5%':'48.3%'}}><PressableScale accessibilityRole="button" accessibilityLabel={`${title}. ${desc}. ${status}`} onPress={()=>nav.navigate(route)} style={[s.tile,{backgroundColor:palette.surface,borderColor:palette.controlBorder}]}><View style={[s.icon,{backgroundColor:`${accent}20`}]}><Ionicons name={icon as never} size={25} color={accent.trim()}/></View><Text style={[t.headline,{color:palette.label,marginTop:14}]}>{title}</Text><Text style={[t.footnote,{color:palette.secondaryLabel,marginTop:4}]}>{desc}</Text><Text style={[t.caption,{color:statusColor,marginTop:12,fontWeight:'600'}]}>{status}</Text></PressableScale></Animated.View>})}</View><Text style={[t.caption,{color:palette.tertiaryLabel,textAlign:'center',marginTop:'auto',paddingVertical:18}]}>DAMAC Lab · v{Constants.expoConfig?.version ?? '1.0.0'} · Expo SDK {Constants.expoConfig?.sdkVersion ?? '58'}</Text></View>;
}
const s=StyleSheet.create({root:{flex:1,paddingTop:10},top:{height:54,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20},intro:{paddingHorizontal:22,paddingTop:24,paddingBottom:20},grid:{width:'100%',alignSelf:'center',paddingHorizontal:18,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:10},tile:{minHeight:180,borderWidth:1,borderRadius:radius.lg,padding:15},icon:{width:44,height:44,borderRadius:15,alignItems:'center',justifyContent:'center'}});
