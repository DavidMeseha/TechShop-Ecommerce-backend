import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Users from '../../models/Users';
import bcrypt from 'bcrypt-nodejs';
import { logoutUser, findUserByEmail } from '../../repositories/user.repository';
import { ACCESS_TOKEN_SECRET } from '../../config/env.config';
import { AppError } from '../../utils/appErrors';

type LoginRequestBody = { email: string; password: string };

export async function login(req: Request, res: Response) {
  const { email, password }: LoginRequestBody = req.body;
  if (!email || !password) throw new AppError('Required email and password', 400);

  const user = await findUserByEmail(email);
  if (!user) throw new AppError('Wrong Credentials', 403);

  const passwordMatching = bcrypt.compareSync(password, user.password ?? '');

  if (!passwordMatching) throw new AppError('Wrong Credentials', 403);
  delete user.password;

  if (!ACCESS_TOKEN_SECRET) throw new AppError('ENV server Error', 500);

  jwt.sign({ ...user }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' }, async (err, token) => {
    if (err) throw new AppError('could not create token', 500);

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
  await logoutUser(user._id);
  res.status(200).json({ status: 'success' });
}
