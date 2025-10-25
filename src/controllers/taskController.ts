import { Request, Response } from 'express';
import * as taskService from '../services/taskService';

interface AuthRequest extends Request {
  userId?: string;
}

/**
 * faz o Handle de erros das requisições relacionadas as tasks
 */
const handleError = (res: Response, error: any) => {
  if (error.message === 'NOT_FOUND') {
    return res.status(404).json({ message: 'Tarefa não encontrada.' });
  }
  if (error.message === 'FORBIDDEN') {
    return res.status(403).json({ message: 'Acesso negado. Você não é o dono deste recurso.' });
  }

  if (error.name === 'ValidationError') {
    console.warn(`[TaskController] Erro de validação: ${error.message}`);

    const messages = Object.values(error.errors).map((err: any) => err.message);
    return res.status(422).json({ message: messages[0] || 'Erro de validação.' });
  }

  console.error(`[TaskController] Erro inesperado: ${error.message}`);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
};

/**
 * Cria uma nova tarefa.
 */
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { description, isDone } = req.body;

    if (!description) {
      return res.status(422).json({ message: 'A descrição (description) é obrigatória.' });
    }

    const taskData = { description, isDone };
    const newTask = await taskService.createTask(taskData, userId);
    
    res.status(201).json(newTask);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Lista todas as tarefas do usuário, com opção de filtro.
 */
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const filters: any = {};
    if (req.query.isDone !== undefined) {
      filters.isDone = req.query.isDone === 'true';
    }

    const tasks = await taskService.findAllByUser(userId, filters);
    res.status(200).json(tasks);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Retorna uma tarefa específica pelo ID.
 */
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const taskId = req.params.id;

    const task = await taskService.findTaskById(taskId, userId);
    res.status(200).json(task);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Atualiza (substitui) uma tarefa.
 */
export const updateTaskPut = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const taskId = req.params.id;
    const { description, isDone } = req.body;

    if (description === undefined || isDone === undefined) {
      return res.status(422).json({ 
        message: 'Requisição PUT inválida. É necessário enviar "description" e "isDone".' 
      });
    }

    const taskData = { description, isDone };
    const updatedTask = await taskService.updateTask(taskId, taskData, userId, false);
    
    res.status(200).json(updatedTask);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * PATCH /tasks/:id
 */
export const updateTaskPatch = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const taskId = req.params.id;
    const { description, isDone } = req.body;
    
    if (description === undefined && isDone === undefined) {
      return res.status(422).json({ 
        message: 'Requisição PATCH inválida. É necessário enviar "description" ou "isDone".' 
      });
    }
    
    const taskData: { description?: string; isDone?: boolean } = {};
    if (description !== undefined) taskData.description = description;
    if (isDone !== undefined) taskData.isDone = isDone;

    const updatedTask = await taskService.updateTask(taskId, taskData, userId, true); // true = isPartial (sim, é parcial, é PATCH)
    
    res.status(200).json(updatedTask);
  } catch (error) {
    handleError(res, error);
  }
};


/**
 * Remove uma tarefa.
 */
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const taskId = req.params.id;

    await taskService.removeTask(taskId, userId);
    
    res.status(204).send(); 
  } catch (error) {
    handleError(res, error);
  }
};