import { Request, Response } from 'express';
import { responseDto } from '../../utils/misc';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../../config/env.config';

export async function refreshToken(req: Request, res: Response) {
  const user = res.locals.user;
  delete user.exp;
  delete user.iat;

  if (!ACCESS_TOKEN_SECRET) return res.status(500).json(responseDto('ENV Server Error'));

  try {
    if (!user) return res.status(400).json(responseDto('Token not valid'));

    const newToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

    return res.status(200).json({ token: newToken });
  } catch (err) {
    return res.status(400).json(err);
  }
}
