import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { resolveTargetUser } from '../../utils/access.js';
import * as schemas from './body.schemas.js';
import * as service from './body.service.js';
import { ACTIVITY, GOALS, energyPlan } from './energy.js';

const router = Router();
router.use(authenticate);

/** Opciones para armar el formulario (niveles de actividad y objetivos con sus textos). */
router.get('/options', (_req, res) => {
  res.json({
    data: {
      activity: Object.entries(ACTIVITY).map(([value, a]) => ({ value, ...a })),
      goals: Object.entries(GOALS).map(([value, g]) => ({ value, label: g.label, hasPace: Boolean(g.pace) })),
    },
  });
});

// Datos corporales y plan: el propio usuario o, con ?userId=, su coach o un admin.
router.get('/', validate({ query: schemas.bodyQuery }), async (req, res) => {
  const userId = await resolveTargetUser(req, req.valid.query.userId, { coachCan: true });
  res.json({ data: await service.getBody(userId) });
});

// Vista previa del cálculo mientras se completa el formulario (no guarda nada).
router.post('/preview', validate({ body: schemas.bodyProfileSchema }), (req, res) => {
  res.json({ data: energyPlan(req.valid.body) });
});

router.put('/', validate({ body: schemas.saveBodySchema }), async (req, res) => {
  res.json({ data: await service.saveBody(req.user.id, req.valid.body) });
});

router.post('/weight', validate({ body: schemas.weightLogSchema }), async (req, res) => {
  res.status(201).json({ data: await service.logWeight(req.user.id, req.valid.body) });
});

export default router;
