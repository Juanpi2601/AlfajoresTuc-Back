import { body } from "express-validator";
import User from '../models/user.model.js';
import passRegex from '../helpers/passwordRegex.js';

const userValidations = {
  email: body("email")
    .isEmail()
    .withMessage('El email no es valido')
    .not()
    .isEmpty()
    .withMessage('Este campo es requerido'),
  password: body('password')
    .matches(passRegex)
    .withMessage('La contraseña no es valida')
};

export default userValidations;