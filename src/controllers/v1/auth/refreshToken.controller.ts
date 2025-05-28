import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '@/config/env.config';
import { AppError } from '@/utils/appErrors';

export async function refreshToken(req: Request, res: Response) {
  const user = res.locals.user;
  delete user.exp;
  delete user.iat;

  if (!ACCESS_TOKEN_SECRET) throw new AppError('ENV server Error', 500);
  if (!user) throw new AppError('Token not valid', 401);

  const newToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
  return res.status(200).json({ token: newToken });
}
