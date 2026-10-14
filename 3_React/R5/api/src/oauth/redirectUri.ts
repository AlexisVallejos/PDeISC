import { config } from "../config.js";

// la vuelta del proveedor cae en una pantalla del cliente; debe ser idéntica en el pedido y en el canje del código
export const redirectUri = (providerName: string): string => `${config.clientUrl}/auth/${providerName}/callback`;
