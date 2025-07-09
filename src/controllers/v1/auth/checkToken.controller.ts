import { Request, Response } from 'express';
import { findUserById, findUserVendor } from '@/repositories/user.repository';
import { AppError } from '@/utils/appErrors';
import { extractToken, verifyToken } from '@/utils/token';
import { cleanUser } from '@/utils/misc';

export async function checkToken(req: Request, res: Response) {
  const token = extractToken(req);

  if (!token) throw new AppError('No valid token provided', 403);

  const userToken = await verifyToken(token);
  if (!userToken) throw new AppError('Token not valid', 403);

  const foundUser = await findUserById(userToken._id);

  if (foundUser && ((foundUser.isLogin && foundUser.isRegistered) || !foundUser.isRegistered)) {
    res.cookie('language', foundUser.language, {
      httpOnly: true,
    });

    return res.status(200).json(cleanUser(foundUser));
  }

  throw new AppError('Token not valid', 403);
}

export async function checkVendor(req: Request, res: Response) {
  const userId = res.locals.userId;
  const foundUser = await findUserById(userId);

  if (foundUser && foundUser.isVendor) {
    const vendor = await findUserVendor(String(foundUser.toJSON()._id));
    return res.status(200).json(vendor);
  }

  throw new AppError('Token not valid', 403);
}
