import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { cleanUser, responseDto } from '../../utils/misc';
import db from '../../repositories/user.repository';
import { ACCESS_TOKEN_SECRET } from '../../config/env.config';

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
    return res.status(500).json(err);
  }
}
