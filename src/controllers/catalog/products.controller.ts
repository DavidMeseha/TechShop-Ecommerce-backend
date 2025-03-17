import { Request, Response } from 'express';
import { responseDto } from '../../utilities';
import db from '../../data/catalog.data';

export async function getSinglProduct(req: Request, res: Response) {
  const userId = res.locals.user?._id;
  const productId = req.params.id;

  if (!productId) return res.status(400).json(responseDto('No Product Id Provided'));

  try {
    const product = await db.findProductById(userId, productId);

    if (!product) return res.status(404).json(responseDto('Product not found'));
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(responseDto('Failed to fetch product'));
  }
}

export async function homeFeed(req: Request, res: Response) {
  try {
    const userId = res.locals.user?._id;
    const page = parseInt(req.query.page?.toString() ?? '1');
    const limit = parseInt(req.query.limit?.toString() ?? '2');

    const result = await db.getHomeFeedProducts(page, limit, userId);
    return res.status(200).json(responseDto(result.data, true, result.pagination));
  } catch (err) {
    console.log(err);
    res.status(500).json(responseDto('Failed to fetch home feed'));
  }
}
