import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { cleanUser, responseDto } from '../../utilities';
import db from '../../data/user.data';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export async function guestToken(req: Request, res: Response) {
  try {
    const newUser = await db.createGuestUser();

    if (!newUser)
      return res
        .status(500)
        .json(responseDto('guest created but ENV Server Error on creating access token'));

    if (!ACCESS_TOKEN_SECRET)
      return res
        .status(500)
        .json(responseDto('guest created but ENV Server Error on creating access token'));

    jwt.sign(cleanUser(newUser), ACCESS_TOKEN_SECRET, { expiresIn: '400d' }, (err, token) => {
      if (err) return res.status(500).json(responseDto('could not create token'));
      return res.status(200).json({
        user: cleanUser(newUser),
        token,
      });
    });
  } catch (err) {
    return res
      .status(500)
      .json(responseDto('guest created but ENV Server Error on creating access token'));
  }
}
