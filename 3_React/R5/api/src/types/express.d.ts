import type { PublicUser } from "./user.js";

// requireAuth carga el usuario real (con su rol actual) en cada pedido protegido
declare global {
  namespace Express {
    interface Request {
      user: PublicUser;
    }
  }
}

export {};
