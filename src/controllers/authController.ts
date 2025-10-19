import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const login = async (req: Request, res: Response) => {

  console.log(`[Login] Recebida tentativa de login para: ${req.body.email}`);
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    console.log(`[Login] Login bem-sucedido para: ${req.body.email}`);
    return res.status(200).json(result);
  } catch (error: any) {

    console.warn(`[Login] Falha no login para ${req.body.email}: ${error.message}`);

    if (error.message === 'Usuário não encontrado.') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Senha incorreta.') {
      return res.status(401).json({ message: error.message });
    }

    console.error(`[Login] Erro inesperado:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};