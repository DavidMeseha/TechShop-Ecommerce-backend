import { Request, Response } from 'express';
import Joi from 'joi';
import { createUser, findUserByEmail } from '../../repositories/user.repository';
import { AppError } from '../../utils/appErrors';

type RegisterRequestBody = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | null;
  dayOfBirth: number;
  monthOfBirth: number;
  yearOfBirth: number;
};

const RegisterSchema = Joi.object<RegisterRequestBody>({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  gender: Joi.string().equal('male', 'female', null).required(),
  password: Joi.string().min(8),
  confirmPassword: Joi.ref('password'),
  dayOfBirth: Joi.number().integer().max(31).min(1),
  monthOfBirth: Joi.number().integer().max(12).min(1),
  yearOfBirth: Joi.number()
    .integer()
    .max(new Date().getFullYear())
    .min(new Date().getFullYear() - 100),
});

export async function register(req: Request, res: Response) {
  const registerForm: RegisterRequestBody = req.body;

  const { error, value } = RegisterSchema.validate({ ...registerForm });

  if (error) {
    let jsonResponse;
    if (error?.details[0].context?.label === 'password')
      jsonResponse = { code: 400, message: 'INVALID_PASSWORD' };
    else if (error?.details[0].context?.label === 'email')
      jsonResponse = { code: 409, message: 'INVALID_EMAIL' };
    throw new AppError(error.message, jsonResponse?.code ?? 400);
  }

  const emailDublicate = !!(await findUserByEmail(value.email));
  if (emailDublicate) throw new AppError('EMAIL_IN_USE', 409);

  const newUser = await createUser({
    ...value,
    isRegistered: true,
    isLogin: false,
    dateOfBirth: {
      day: value.dayOfBirth,
      month: value.monthOfBirth,
      year: value.yearOfBirth,
    },
  });

  if (newUser) res.status(201).json({ success: true, message: 'user registered successfully' });
  else throw new AppError('Failed to create user in databse', 500);
}
