import { Router } from "express";
import { create } from "../controllers/users/create.js";
import { list } from "../controllers/users/list.js";
import { remove } from "../controllers/users/remove.js";
import { update } from "../controllers/users/update.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// solo administradores
router.use(requireAuth, requireAdmin);
router.post("/listar", list);
router.post("/crear", create);
router.post("/actualizar", update);
router.post("/eliminar", remove);

export default router;
