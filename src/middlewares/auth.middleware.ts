import { NextFunction, Request, Response } from 'express';
import { extractToken, verifyToken } from '@/utils/token';
import { AppError } from '@/utils/appErrors';
import { asyncHandler } from '@/utils/asyncHandler';

export const userAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) throw new AppError('No token provided', 403);

  const user = await verifyToken(token);
  if (!user.isRegistered) throw new AppError('You Need to Signup', 401);

  res.locals.user = user;
  res.locals.userId = user._id;
  next();
});

export const apiAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) throw new AppError('No token provided', 403);

  const user = await verifyToken(token);

  res.locals.user = user;
  res.locals.userId = user._id;
  next();
});

export async function fetchUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    const user = await verifyToken(token ?? '');
    res.locals.userId = user._id;
  } catch {
    res.locals.userId = '';
  } finally {
    next();
  }
}
