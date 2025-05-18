import { Request, Response } from 'express';
import { responseDto } from '../../utils/misc';
import { IProductReview } from '../../interfaces/product.interface';
import { createReview } from '../../repositories/review.repository';
import { userReviews } from '../../repositories/user.repository';

export async function addReview(req: Request, res: Response) {
  const userId = res.locals.userId;
  const productId: string = req.params.id;
  const review: Partial<IProductReview> = req.body;

  if (!review.customer || !review.product || review.rating || !review.reviewText)
    throw new Error('Must provide customeId, ProductId, a rate, and reviewText');

  const savedReview = await createReview(userId, productId, review as IProductReview);
  res.status(200).json(savedReview);
}

export async function getReviews(req: Request, res: Response) {
  const userId = res.locals.userId;
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = 5;

  const reviews = await userReviews(userId, { limit, page });
  const hasNext = reviews.length > limit && !!reviews.pop();
  res.status(200).json(responseDto(reviews, true, { hasNext, limit, current: page }));
}
