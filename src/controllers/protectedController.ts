import { Request, Response } from 'express';

interface AuthRequest extends Request {
  userId?: string;
}

export const getProtectedData = (req: AuthRequest, res: Response) => {

  console.log(`[Protected] Rota acessada com sucesso pelo user ID ${req.userId}`);

  res.status(200).json({
    message: 'Acesso autorizado à rota protegida!',
    userId: req.userId, 
  });
};