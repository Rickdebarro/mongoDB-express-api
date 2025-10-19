import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { loginInterface } from '../interfaces/loginInterface';

export const loginUser = async (loginData: loginInterface) => {
  const { email, password } = loginData;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  const isPasswordMatch = await bcrypt.compare(password!, user.password);
  if (!isPasswordMatch) {
    throw new Error('Senha incorreta.');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('Chave secreta JWT não foi configurada.');
    throw new Error('Erro na configuração do servidor.'); // Erro 500
  }

  const token = jwt.sign({ id: user._id }, secret, {
    expiresIn: '8h',
  });

  return { token };
};