import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const newUser = await userService.registerUser({ name, email, password });

    return res.status(201).json(newUser);
  } catch (error: any) {

    if (error.message === 'Este e-mail já está cadastrado.') {
      return res.status(409).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};