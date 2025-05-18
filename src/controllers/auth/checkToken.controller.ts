import { Request, Response } from 'express';
import { findUserById } from '../../repositories/user.repository';
import { AppError } from '../../utils/appErrors';
import { extractToken, verifyToken } from '../../utils/token';

export async function checkToken(req: Request, res: Response) {
  const token = extractToken(req);

  if (token) {
    const userToken = await verifyToken(token);
    if (!userToken) throw new AppError('Token not valid', 400);

    const foundUser = await findUserById(userToken._id);

    if (foundUser && ((foundUser.isLogin && foundUser.isRegistered) || !foundUser.isRegistered)) {
      res.cookie('language', foundUser.language, {
        httpOnly: true,
      });
      return res.status(200).json(foundUser);
    }

    throw new AppError('Token not valid', 400);
  } else {
    throw new AppError('No valid token provided', 400);
  }
}
