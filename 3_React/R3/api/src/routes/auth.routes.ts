import { Router } from "express";
import { login } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { register } from "../controllers/auth/register.js";
import { session } from "../controllers/auth/session.js";
import { updateProfile } from "../controllers/auth/updateProfile.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiters.js";

const router = Router();

// todos los endpoints son POST
router.post("/registro", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/sesion", requireAuth, session);
router.post("/perfil", requireAuth, updateProfile);

export default router;
