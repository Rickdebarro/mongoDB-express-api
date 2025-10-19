import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {

  const authHeader = req.headers.authorization;


  if (!authHeader) {
    console.warn(`[Auth] Falha: Token não fornecido. Rota: ${req.path}`);
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    console.warn(`[Auth] Falha: Erro no formato do token. Rota: ${req.path}`);
    return res.status(401).json({ message: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    console.warn(`[Auth] Falha: Token mal formatado (sem 'Bearer'). Rota: ${req.path}`);
    return res.status(401).json({ message: 'Token mal formatado.' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error(`[Auth] Erro Crítico: JWT_SECRET não está configurado.`);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }

  jwt.verify(token, secret, (err, decoded: any) => {
    if (err) {
      console.warn(`[Auth] Falha: Token inválido ou expirado. Erro: ${err.message}. Rota: ${req.path}`);
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    req.userId = decoded.id;

    console.log(`[Auth] Sucesso: Acesso liberado para user ID ${req.userId} na rota ${req.path}`);

    return next();
  });
};