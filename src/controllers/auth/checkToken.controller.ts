import { Request, Response } from 'express';
import { responseDto } from '../../utils/misc';
import { IUserTokenPayload } from '../../interfaces/user.interface';
import jwt from 'jsonwebtoken';
import db from '../../repositories/user.repository';
import { ACCESS_TOKEN_SECRET } from '../../config/env.config';

export async function checkToken(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    if (!ACCESS_TOKEN_SECRET) return res.status(500).json(responseDto('ENV Server Error'));

    try {
      const userToken = jwt.verify(token, ACCESS_TOKEN_SECRET) as IUserTokenPayload;

      if (!userToken) return res.status(400).json(responseDto('Token not valid'));

      const foundUser = await db.findUserById(userToken._id);

      if (foundUser && ((foundUser.isLogin && foundUser.isRegistered) || !foundUser.isRegistered)) {
        res.cookie('language', foundUser.language, {
          httpOnly: true,
        });
        return res.status(200).json(foundUser);
      } else res.status(400).json(responseDto('Token not valid'));
    } catch (err) {
      return res.status(400).json(err);
    }
  } else {
    res.status(400).json(responseDto('No valid token provided'));
  }
}
