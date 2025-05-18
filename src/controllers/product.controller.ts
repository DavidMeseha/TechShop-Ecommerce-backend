import { Request, Response } from 'express';
import {
  productAttributes,
  productDetails,
  productReviews,
} from '../repositories/product.repository';
import { AppError } from '../utils/appErrors';
import { findProductBySeName } from '../repositories/catalog.repository';

export async function getProductAttributes(req: Request, res: Response) {
  const { seName } = req.params;
  if (!seName) throw new AppError('Invalid product seName', 400);

  const product = await productAttributes(seName);
  if (!product) throw new AppError('Product not found', 404);

  return res.status(200).json(product);
}

export async function getProductDetails(req: Request, res: Response) {
  const userId = res.locals.userId;
  const seName = req.params.seName;
  if (!seName) throw new AppError('product seName is required', 400);

  const product = await productDetails(userId, seName);
  if (!product) throw new AppError('Product not found', 404);

  return res.status(200).json(product);
}

export async function getReviews(req: Request, res: Response) {
  const id = req.params.id;
  if (!id) throw new AppError('id is required', 400);

  const reviews = await productReviews(id);
  return res.status(200).json(reviews);
}

export async function getUserActions(req: Request, res: Response) {
  const userId = res.locals.userId;
  const { seName } = req.params;
  if (!seName) throw new AppError('product seName is required', 400);

  const product = await findProductBySeName(userId, seName);
  if (!product) throw new AppError('Product not found', 404);

  const isLiked = product.usersLiked.includes(userId);
  const isSaved = product.usersSaved.includes(userId);
  const isReviewed = product.usersReviewed.includes(userId);
  const isInCart = product.usersCarted.includes(userId);

  return res.status(200).json({ isLiked, isReviewed, isInCart, isSaved });
}
