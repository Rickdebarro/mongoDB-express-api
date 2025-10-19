import { body } from 'express-validator';

export const registerRules = [
  body('name')
    .notEmpty().withMessage('O nome é obrigatório.')
    .isLength({ min: 3 }).withMessage('O nome precisa ter no mínimo 3 caracteres.'),

  body('email')
    .notEmpty().withMessage('O e-mail é obrigatório.')
    .isEmail().withMessage('Por favor, insira um e-mail válido.'),

  body('password')
    .notEmpty().withMessage('A senha é obrigatória.')
    .isLength({ min: 6 }).withMessage('A senha precisa ter no mínimo 6 caracteres.'),
];

export const loginRules = [
  body('email')
    .notEmpty().withMessage('O e-mail é obrigatório.')
    .isEmail().withMessage('Por favor, insira um e-mail válido.'),

  body('password')
    .notEmpty().withMessage('A senha é obrigatória.'),
];