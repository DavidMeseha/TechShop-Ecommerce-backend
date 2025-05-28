import { Request, Response } from 'express';
import { isValidIdFormat } from '@/utils/misc';
import { AppError } from '@/utils/appErrors';
import { like, likedProducts, unLike } from '@/repositories/like.repository';

export async function likeProduct(req: Request, res: Response) {
  const userId = res.locals.userId;
  const { id: productId } = req.params;
  if (!isValidIdFormat(productId)) throw new AppError('productId is Required', 400);

  const productUpdate = await like(userId, productId);
  if (!productUpdate.matchedCount)
    throw new AppError('Could not like Product it might be already liked', 409);

  return res.status(200).json({ Success: true, message: 'Product liked successfully' });
}

export async function unlikeProduct(req: Request, res: Response) {
  const userId = res.locals.userId;
  const { id: productId } = req.params;
  if (!isValidIdFormat(productId)) throw new AppError('productId is Required', 400);

  const productUpdate = await unLike(userId, productId);
  if (!productUpdate.matchedCount)
    throw new AppError('Could not unlike Product it might be not liked', 409);

  return res.status(200).json({ Success: true, message: 'Product unliked' });
}

export async function getLikedProducts(req: Request, res: Response) {
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = parseInt(req.query.limit?.toString() ?? '20');

  const userId = res.locals.userId;
  const products = await likedProducts(userId, { page, limit });
  res.status(200).json(products);
}
