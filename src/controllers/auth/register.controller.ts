import { Request, Response } from 'express';
import Joi from 'joi';
import { responseDto } from '../../utils/misc';
import { createUser, findUserByEmail } from '../../repositories/user.repository';

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
      jsonResponse = { message: 'password is not vaild', code: 'INVALID_PASSWORD' };
    else if (error?.details[0].context?.label === 'email')
      jsonResponse = { message: 'email is not vaild', code: 'INVALID_EMAIL' };
    return res.status(400).json(jsonResponse);
  }

  const emailDublicate = !!(await findUserByEmail(value.email));
  if (emailDublicate)
    return res.status(400).json({ code: 'EMAIL_IN_USE', message: 'Email already in use' });

  const newUser = await createUser({
    ...value,
    isRegistered: true,
    isLogin: false,
    dateOfBirth: {
      day: value.dayOfBirth,
      month: value.monthOfBirth,
      year: value.yearOfBirth,
    },
  }).catch(() => res.status(500).json({ message: res.locals.t('serverError') }));

  if (newUser) res.status(200).json(responseDto('Registerd Successfully', true));
  else res.status(500).json(responseDto('Failed to create user in databse'));
}
