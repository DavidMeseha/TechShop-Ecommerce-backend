import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { cleanUser } from '../../utils/misc';
import { createGuestUser } from '../../repositories/user.repository';
import { ACCESS_TOKEN_SECRET } from '../../config/env.config';
import { AppError } from '../../utils/appErrors';

export async function guestToken(req: Request, res: Response) {
  const newUser = await createGuestUser();
  if (!newUser) throw new AppError('failed to create user', 500);

  if (!ACCESS_TOKEN_SECRET)
    throw new AppError('guest created but ENV Server Error on creating access token', 500);

  jwt.sign(cleanUser(newUser), ACCESS_TOKEN_SECRET, { expiresIn: '400d' }, (err, token) => {
    if (err) throw new AppError('could not create token', 500);
    return res.status(200).json({
      user: cleanUser(newUser),
      token,
    });
  });
}
