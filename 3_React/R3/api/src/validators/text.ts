// helpers para revisar que un dato llegue como texto
export const isText = (value: unknown): value is string => typeof value === "string";

export const cleanText = (value: unknown): string => (isText(value) ? value.trim() : "");
