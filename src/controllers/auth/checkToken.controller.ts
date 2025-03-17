import { Request, Response } from 'express';
import { responseDto } from '../../utilities';
import { IUserTokenPayload } from '../../interfaces/user.interface';
import jwt from 'jsonwebtoken';
import db from '../../data/user.data';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

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
      return res.status(400).json('Token not valid');
    }
  } else {
    res.status(400).json(responseDto('No valid token provided'));
  }
}
