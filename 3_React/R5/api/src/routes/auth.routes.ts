import { Router } from "express";
import { login } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { register } from "../controllers/auth/register.js";
import { session } from "../controllers/auth/session.js";
import { updateProfile } from "../controllers/auth/updateProfile.js";
import { oauthCallback } from "../controllers/oauth/callback.js";
import { oauthProviders } from "../controllers/oauth/providers.js";
import { oauthUrl } from "../controllers/oauth/url.js";
import { oauthReturn } from "../controllers/oauth/return.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { loginLimiter, oauthLimiter, registerLimiter } from "../middleware/rateLimiters.js";

const router = Router();

// El retorno del proveedor llega por GET; el cliente usa POST para las operaciones.
router.get("/oauth/return/:provider", oauthReturn);
router.post("/registro", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/oauth/proveedores", oauthProviders);
router.post("/oauth/url", oauthLimiter, oauthUrl);
router.post("/oauth/callback", oauthLimiter, oauthCallback);
router.post("/logout", logout);
router.post("/sesion", requireAuth, session);
router.post("/perfil", requireAuth, updateProfile);

export default router;
