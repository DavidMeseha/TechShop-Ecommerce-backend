import { Request, Response } from 'express';
import {
  updatePassword,
  updateUserInformation,
  userInformation,
} from '../../repositories/user.repository';
import { UserInfoBody } from '../../interfaces/user.interface';
import { AppError } from '../../utils/appErrors';

export async function getUserInfo(req: Request, res: Response) {
  const userId = res.locals.userId;
  const userInfo = await userInformation(userId);
  if (!userInfo) throw new AppError('failed to get User', 500);

  return res.status(200).json(userInfo);
}

export async function updateInfo(req: Request, res: Response) {
  const userId = res.locals.userId;
  const form: UserInfoBody = req.body;

  const userProfile = await updateUserInformation(userId, form);
  res.status(200).json(userProfile);
}

export async function changePassword(req: Request, res: Response) {
  const userId = res.locals.userId;
  const { password, newPassword }: { password: string; newPassword: string } = req.body;
  if (!password || !newPassword) throw new AppError('password and new passwords are required', 400);
  if (newPassword.length < 8)
    throw new AppError('new passwords should be more than 8 characters', 400);

  await updatePassword(userId, password, newPassword);
  res.status(200).json('Password updated successfully');
}
