import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import * as protectedController from '../controllers/protectedController';

const router = Router();

router.get('/protected', authMiddleware, protectedController.getProtectedData);

export default router;