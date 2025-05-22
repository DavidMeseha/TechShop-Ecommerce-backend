import { Request, Response } from 'express';
import { findUserById } from '../../repositories/user.repository';
import { AppError } from '../../utils/appErrors';
import { extractToken, verifyToken } from '../../utils/token';
import { cleanUser } from '../../utils/misc';

export async function checkToken(req: Request, res: Response) {
  const token = extractToken(req);

  if (token) {
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
  } else {
    throw new AppError('No valid token provided', 403);
  }
}
