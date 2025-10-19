import { Router } from 'express';
import * as authController from '../controllers/authController';
import { loginRules } from '../middlewares/validationRules';
import { validate } from '../middlewares/validationMiddleware';

const router = Router();


router.post('/login', loginRules, validate, authController.login);

export default router;