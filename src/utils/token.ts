import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../config/env.config';

export const verifyToken = (token: string) => {
  return new Promise((resolve, reject) => {
    if (!ACCESS_TOKEN_SECRET) {
      throw new Error('ENV server Error');
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err || !payload) {
        reject(err);
      }
      resolve(payload);
    });
  });
};

export const extractToken = (req: Request) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new Error('Not Authorized');
  }

  return token;
};
