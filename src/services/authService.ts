import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel';
import { loginInterface } from '../interfaces/loginInterface';
export const loginUser = async (loginData: loginInterface) => {
  const { email, password } = loginData;

  const user = await userModel.findOne({ email }).select('+password');


  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Credenciais inválidas.');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('Chave secreta JWT não foi configurada.');
    throw new Error('Erro na configuração do servidor.');
  }

  const token = jwt.sign({ id: user._id }, secret, {
    expiresIn: '1h',
  });

  return { token };
};