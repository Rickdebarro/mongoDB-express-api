import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const result = await authService.loginUser({ email, password });

    return res.status(200).json(result);
  } catch (error: any) {

    if (error.message === 'Credenciais inválidas.') {
      return res.status(401).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};