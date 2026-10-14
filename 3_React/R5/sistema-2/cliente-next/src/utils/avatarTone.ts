// mismo nombre, mismo color: elige un tono estable a partir del texto
export function avatarTone(name: string, tones: readonly string[]): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return tones[hash % tones.length];
}
