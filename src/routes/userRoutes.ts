import { Router } from 'express';
import * as userController from '../controllers/userController';
import { registerRules } from '../middlewares/validationRules';
import { validate } from '../middlewares/validationMiddleware';

const router = Router();

router.post('/register', registerRules, validate, userController.register);

export default router;