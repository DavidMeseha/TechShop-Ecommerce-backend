import express from 'express';
import uploadMiddleware from '@/middlewares/upload.middleware';
import { asyncHandler } from '@/utils/asyncHandler';
import { uploadImage } from '@/controllers/v1/uploadImage.controller';
import { userAuth } from '@/middlewares/auth.middleware';

const router = express.Router();
router.post('/upload', userAuth, uploadMiddleware.single('image'), asyncHandler(uploadImage));

export default router;
