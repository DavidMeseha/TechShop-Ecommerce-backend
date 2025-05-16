import { NextFunction, Request, Response } from 'express';
import { responseDto } from '../utils/misc';
import { extractToken, verifyToken } from '../utils/token';
import { IUserTokenPayload } from '../interfaces/user.interface';

export async function userAuth(req: Request, res: Response, next: NextFunction) {
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

export async function apiAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    const payload = await verifyToken(token);

    const user: IUserTokenPayload = JSON.parse(JSON.stringify(payload));

    res.locals.user = user;
    res.locals.userId = user._id;
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication Error';
    return res.status(403).json(responseDto(message, false));
  }
}

export async function fetchUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    const payload = await verifyToken(token);

    res.locals.userId = JSON.parse(JSON.stringify(payload));
  } catch {
    res.locals.userId = '';
  } finally {
    next();
  }
}
