import Task, { taskInterface } from '../models/taskModel'; // Importamos o modelo e a interface que acabou de criar
import mongoose from 'mongoose';


interface ITaskCreate {
  description: string;
  isDone?: boolean;
}

interface ITaskUpdate {
  description?: string;
  isDone?: boolean;
}

interface ITaskFilters {
  isDone?: boolean;
}


/**
 * Verifica se a tarefa existe e se pertence ao usuário
 */
const checkTaskOwner = async (taskId: string, userId: string): Promise<taskInterface> => {

  // Verifica se o ID da tarefa é válido  
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    console.warn(`[TaskService] Tentativa de acesso com ID inválido: ${taskId}`);
    throw new Error('NOT_FOUND'); 
  }

  const task = await Task.findById(taskId);

  if (!task) {
    console.warn(`[TaskService] Tarefa não encontrada. TaskID: ${taskId}, UserID: ${userId}`);
    throw new Error('NOT_FOUND');
  }

  if (task.user.toString() !== userId) {
    console.warn(`[TaskService] ACESSO NEGADO. UserID ${userId} tentou aceder à TaskID ${taskId}`);
    throw new Error('FORBIDDEN');
  }
  
  return task;
};


/**
 * Cria uma nova tarefa
 */
export const createTask = async (taskData: ITaskCreate, userId: string): Promise<taskInterface> => {
  console.log(`[TaskService] Criando nova tarefa para o UserID: ${userId}`);
  
  const task = new Task({
    ...taskData,
    user: userId,
  });

  await task.save();

  return task;
};

/**
 * Encontra todas as tarefas associadas ao usuário (Filtro de check da tarefa)
 */
export const findAllByUser = async (userId: string, filters: ITaskFilters): Promise<taskInterface[]> => {
  console.log(`[TaskService] Buscando tarefas para o UserID: ${userId} com filtros:`, filters);

  const query: any = { user: userId };

  if (filters.isDone !== undefined) {
    query.isDone = filters.isDone;
  }

  const tasks = await Task.find(query).sort({ createdAt: -1 });
  return tasks;
};

/**
 * Encontra uma tarefa específica pelo ID.
 */
export const findTaskById = async (taskId: string, userId: string): Promise<taskInterface> => {
  console.log(`[TaskService] Buscando tarefa por ID. TaskID: ${taskId}, UserID: ${userId}`);
  
  // A segurança (404 e 403) é toda tratada por esta função
  const task = await checkTaskOwner(taskId, userId);
  return task;
};

/**
 * Atualiza uma tarefa (PUT ou PATCH).
 */
export const updateTask = async (
  taskId: string,
  taskData: ITaskUpdate,
  userId: string,
  isPartial: boolean = true
): Promise<taskInterface> => {
  console.log(`[TaskService] Atualizando tarefa. TaskID: ${taskId}, UserID: ${userId}, Parcial: ${isPartial}`);
  
  await checkTaskOwner(taskId, userId);

  let updatedTask: taskInterface | null;

  if (isPartial) {
    updatedTask = await Task.findByIdAndUpdate(taskId, taskData, {
      new: true,
      runValidators: true,
    });
  } else {

    const dataToUpdate = {
      description: taskData.description,
      isDone: taskData.isDone || false 
    };

    updatedTask = await Task.findByIdAndUpdate(taskId, dataToUpdate, {
      new: true,
      runValidators: true,
      overwrite: true, 
    });
  }

  if (!updatedTask) {
    throw new Error('NOT_FOUND');
  }

  return updatedTask;
};

/**
 * Remove uma tarefa.
 */
export const removeTask = async (taskId: string, userId: string): Promise<void> => {
  console.log(`[TaskService] Removendo tarefa. TaskID: ${taskId}, UserID: ${userId}`);

  await checkTaskOwner(taskId, userId);


  const result = await Task.findByIdAndDelete(taskId);

  if (!result) {
    throw new Error('NOT_FOUND');
  }

};