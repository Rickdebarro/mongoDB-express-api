import User from '../models/userModel';
import { userInterface } from '../interfaces/userInterface';

export const registerUser = async (userData: userInterface) => {

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  const user = new User({
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });

  await user.save(); 

  const { password, ...userWithoutPassword } = user.toObject();

  return userWithoutPassword;
};