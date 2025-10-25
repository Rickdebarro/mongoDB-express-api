import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

//Definir rota mãe index.ts

router.use(authMiddleware);

router.post('/', taskController.createTask);

router.get('/', taskController.getTasks);

router.get('/:id', taskController.getTaskById);

router.put('/:id', taskController.updateTaskPut);

router.patch('/:id', taskController.updateTaskPatch);

router.delete('/:id', taskController.deleteTask);


export default router;