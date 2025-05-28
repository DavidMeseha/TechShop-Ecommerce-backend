import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { cleanUser } from '@/utils/misc';
import { createGuestUser } from '@/repositories/user.repository';
import { ACCESS_TOKEN_SECRET } from '@/config/env.config';
import { AppError } from '@/utils/appErrors';

export async function guestToken(req: Request, res: Response) {
  const newUser = await createGuestUser();

  if (!ACCESS_TOKEN_SECRET)
    throw new AppError('guest created but ENV Server Error on creating access token', 500);

  jwt.sign(cleanUser(newUser), ACCESS_TOKEN_SECRET, { expiresIn: '400d' }, (err, token) => {
    if (err) throw new AppError('could not create token', 500);
    const userAdjusted = cleanUser(newUser);
    return res.status(200).json({
      token,
      user: {
        _id: userAdjusted._id,
        imageUrl: userAdjusted.imageUrl,
        language: userAdjusted.language,
        firstName: userAdjusted.firstName,
        lastName: userAdjusted.lastName,
        isVendor: userAdjusted.isVendor,
        isRegistered: userAdjusted.isRegistered,
      },
    });
  });
}
