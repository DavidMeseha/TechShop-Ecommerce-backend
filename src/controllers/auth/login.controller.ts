import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Users from '../../models/Users';
import bcrypt from 'bcrypt-nodejs';
import { responseDto } from '../../utils/misc';
import db from '../../repositories/user.repository';
import { ACCESS_TOKEN_SECRET } from '../../config/env.config';

type LoginRequestBody = { email: string; password: string };

export async function login(req: Request, res: Response) {
  const { email, password }: LoginRequestBody = req.body;
  const user = await db.findUserByEmail(email);

  if (!user) return res.status(403).json({ message: 'Wrong Credentials' });
  const passwordMatching = bcrypt.compareSync(password, user.password ?? '');

  if (!passwordMatching) return res.status(403).json({ message: 'Wrong Credentials' });
  delete user.password;

  if (!ACCESS_TOKEN_SECRET)
    return res.status(500).json(responseDto('user created but ENV Server Error'));

  jwt.sign({ ...user }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' }, async (err, token) => {
    if (err) return res.status(500).json(responseDto('could not create token'));

    res.status(200).json({
      user,
      token,
      expiry: new Date().setDate(new Date().getDate() + 30),
    });
    await Users.updateOne({ _id: user._id }, { isLogin: true });
  });
}

export async function logout(req: Request, res: Response) {
  const user = res.locals.user;
  await db.logout(user._id);
  res.status(200).json('success');
}
