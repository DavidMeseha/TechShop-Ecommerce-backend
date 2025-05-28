import { Request, Response } from 'express';
import { responseDto } from '@/utils/misc';
import { findProductBySeName, getHomeFeedProducts } from '@/repositories/catalog.repository';
import { AppError } from '@/utils/appErrors';

export async function getSinglProduct(req: Request, res: Response) {
  const userId = res.locals.userId;
  const seName = req.params.seName;
  if (!seName) throw new AppError('seName should be provided', 400);

  const product = await findProductBySeName(userId, seName);
  if (!product) throw new AppError('product not found', 404);

  res.status(200).json(product);
}

export async function homeFeed(req: Request, res: Response) {
  const userId = res.locals.userId;
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = parseInt(req.query.limit?.toString() ?? '2');

  const result = await getHomeFeedProducts(page, limit, userId);
  return res.status(200).json(responseDto(result.data, true, result.pagination));
}
