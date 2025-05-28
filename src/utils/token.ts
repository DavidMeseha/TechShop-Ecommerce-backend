import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '@/config/env.config';
import { AppError } from './appErrors';
import { IUserTokenPayload } from '@/types/user.interface';
import { isValidIdFormat } from './misc';

export const verifyToken = (token: string): Promise<IUserTokenPayload> => {
  return new Promise((resolve) => {
    if (!ACCESS_TOKEN_SECRET) throw new AppError('ENV server Error', 500);

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err || !payload) throw new AppError(err?.message ?? 'Failed to verify token', 403);

      const user = JSON.parse(JSON.stringify(payload)) as IUserTokenPayload;
      if (!isValidIdFormat(user._id)) throw new AppError('could not get user id missmatch', 403);

      resolve(user);
    });
  });
};

export const extractToken = (req: Request) => {
  const token = req.headers.authorization?.split(' ')[1];
  return token;
};
