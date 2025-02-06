import { Request, Response } from 'express';
import { put } from '@vercel/blob';

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  try {
    const file = req.file;
    const blob = await put(file.originalname, file.buffer, {
      access: 'public',
      token: process.env.FILES_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ imageUrl: blob.url });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ message: 'Failed to upload file' });
  }
};
