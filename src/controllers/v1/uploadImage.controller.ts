import { Request, Response } from 'express';
import { put } from '@vercel/blob';
import { FILES_READ_WRITE_TOKEN } from '@/config/env.config';
import { AppError } from '@/utils/appErrors';

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) throw new AppError('No file provided', 400);

  const file = req.file;
  const blob = await put(file.originalname, file.buffer, {
    access: 'public',
    token: FILES_READ_WRITE_TOKEN,
  });

  return res.status(200).json({ imageUrl: blob.url });
};
