import { Request, Response } from 'express';
import { responseDto } from '../../utils/misc';
import db from '../../repositories/catalog.repository';

export async function getSinglProduct(req: Request, res: Response) {
  const userId = res.locals.userId;
  const productId = req.params.id;

  if (!productId) return res.status(400).json(responseDto('No Product Id Provided'));

  try {
    const product = await db.findProductById(userId, productId);

    if (!product) return res.status(404).json(responseDto('Product not found'));
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(responseDto(err));
  }
}

export async function homeFeed(req: Request, res: Response) {
  try {
    const userId = res.locals.userId;
    const page = parseInt(req.query.page?.toString() ?? '1');
    const limit = parseInt(req.query.limit?.toString() ?? '2');

    const result = await db.getHomeFeedProducts(page, limit, userId);
    return res.status(200).json(responseDto(result.data, true, result.pagination));
  } catch (err) {
    res.status(500).json(responseDto(err));
  }
}
