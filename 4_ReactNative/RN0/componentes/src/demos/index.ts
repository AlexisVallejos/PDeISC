import type { ComponentType } from 'react';
import { AccessibilityInfoDemo, AnimatedDemo, LinkingDemo, PixelRatioDemo, ShareDemo, StyleSheetDemo, UseColorSchemeDemo, VibrationDemo } from './ApisDemos';
import { ActivityIndicatorDemo, AlertDemo, ModalDemo, StatusBarDemo } from './AvisosDemos';
import { ImageBackgroundDemo, ImageDemo, ScrollViewDemo, TextDemo, TextInputDemo, ViewDemo } from './BasicosDemos';
import { ButtonDemo, PressableDemo, SwitchDemo, TouchableHighlightDemo, TouchableOpacityDemo, TouchableWithoutFeedbackDemo } from './InteraccionDemos';
import { FlatListDemo, RefreshControlDemo, SectionListDemo, VirtualizedListDemo } from './ListasDemos';
import { KeyboardAvoidingViewDemo, KeyboardDemo, SafeAreaViewDemo, UseWindowDimensionsDemo } from './PantallaDemos';
import {
  ActionSheetIOSDemo,
  BackHandlerDemo,
  DrawerLayoutAndroidDemo,
  InputAccessoryViewDemo,
  PlatformDemo,
  TouchableNativeFeedbackDemo,
  ToastAndroidDemo,
} from './PlataformaDemos';

/** Demo en vivo de cada ficha, por id (mismo id que en data/componentes.ts). */
export const demos: Record<string, ComponentType> = {
  view: ViewDemo,
  text: TextDemo,
  image: ImageDemo,
  'image-background': ImageBackgroundDemo,
  'text-input': TextInputDemo,
  'scroll-view': ScrollViewDemo,

  pressable: PressableDemo,
  button: ButtonDemo,
  switch: SwitchDemo,
  'touchable-opacity': TouchableOpacityDemo,
  'touchable-highlight': TouchableHighlightDemo,
  'touchable-without-feedback': TouchableWithoutFeedbackDemo,

  'flat-list': FlatListDemo,
  'section-list': SectionListDemo,
  'virtualized-list': VirtualizedListDemo,
  'refresh-control': RefreshControlDemo,

  'activity-indicator': ActivityIndicatorDemo,
  modal: ModalDemo,
  'status-bar': StatusBarDemo,
  alert: AlertDemo,

  'safe-area-view': SafeAreaViewDemo,
  'keyboard-avoiding-view': KeyboardAvoidingViewDemo,
  'use-window-dimensions': UseWindowDimensionsDemo,
  keyboard: KeyboardDemo,

  platform: PlatformDemo,
  'touchable-native-feedback': TouchableNativeFeedbackDemo,
  'drawer-layout-android': DrawerLayoutAndroidDemo,
  'toast-android': ToastAndroidDemo,
  'back-handler': BackHandlerDemo,
  'input-accessory-view': InputAccessoryViewDemo,
  'action-sheet-ios': ActionSheetIOSDemo,

  'style-sheet': StyleSheetDemo,
  animated: AnimatedDemo,
  'use-color-scheme': UseColorSchemeDemo,
  linking: LinkingDemo,
  share: ShareDemo,
  vibration: VibrationDemo,
  'pixel-ratio': PixelRatioDemo,
  'accessibility-info': AccessibilityInfoDemo,
};
