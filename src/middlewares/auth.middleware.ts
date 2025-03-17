import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { responseDto } from '../utilities';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyToken = (token: string) => {
  if (!ACCESS_SECRET) {
    throw new Error('ENV server Error');
  }
  return new Promise((resolve, reject) => {
    jwt.verify(token, ACCESS_SECRET, (err, payload) => {
      if (err || !payload) {
        reject(err);
      }
      resolve(payload);
    });
  });
};

const extractToken = (req: Request) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('Not Authorized');
  }
  return token;
};

export async function userAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    const payload = await verifyToken(token);

    const user = JSON.parse(JSON.stringify(payload));

    if (!user.isRegistered) {
      return res.status(401).json(responseDto('You Need to Signup', false));
    }

    res.locals.user = user;
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication Error';
    if (message === 'ENV server Error') {
      return res.status(500).json(responseDto(message, false));
    }
    return res.status(403).json(responseDto(message, false));
  }
}

export async function apiAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    const payload = await verifyToken(token);

    res.locals.user = JSON.parse(JSON.stringify(payload));
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication Error';
    if (message === 'ENV server Error') {
      return res.status(500).json(responseDto(message, false));
    }
    return res.status(403).json(responseDto(message, false));
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    const payload = await verifyToken(token);

    res.locals.user = JSON.parse(JSON.stringify(payload));
    next();
  } catch (error) {
    next();
  }
}
