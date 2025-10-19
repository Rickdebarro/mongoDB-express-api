import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const register = async (req: Request, res: Response) => {

  console.log(`[Register] Recebida tentativa de registro para: ${req.body.email}`);
  try {
    const { name, email, password } = req.body;
    const newUser = await userService.registerUser({ name, email, password });


    console.log(`[Register] Usuário criado com sucesso. ID: ${newUser._id}`);
    return res.status(201).json(newUser);
  } catch (error: any) {

    console.warn(`[Register] Falha no registro para ${req.body.email}: ${error.message}`);
    if (error.message === 'Este e-mail já está cadastrado.') {
      return res.status(409).json({ message: error.message });
    }

    
    console.error(`[Register] Erro inesperado:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};