import { Request, Response } from 'express';
import { responseDto } from '../../utils/misc';
import { like, likedProducts, unLike } from '../../repositories/like.repository';
import { AppError } from '../../utils/appErrors';

export async function likeProduct(req: Request, res: Response) {
  const userId = res.locals.userId;
  const { id: productId } = req.params;
  if (!productId) throw new AppError('productId is Required', 400);

  const productUpdate = await like(userId, productId);
  if (!productUpdate.matchedCount)
    throw new AppError('Could not like Product it might be already liked', 409);

  return res.status(200).json(responseDto('Product liked successfully', true));
}

export async function unlikeProduct(req: Request, res: Response) {
  const userId = res.locals.userId;
  const { id: productId } = req.params;
  if (!productId) throw new AppError('productId is Required', 400);

  const productUpdate = await unLike(userId, productId);
  if (!productUpdate.matchedCount)
    throw new AppError('Could not unlike Product it might be not liked', 409);

  return res.status(200).json('Product unliked successfully');
}

export async function getLikedProducts(req: Request, res: Response) {
  const userId = res.locals.userId;
  const products = await likedProducts(userId);
  res.status(200).json(products);
}
