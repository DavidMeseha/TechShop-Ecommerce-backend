import { Request, Response } from 'express';
import { responseDto } from '../../utilities';
import mongoose from 'mongoose';
import Products from '../../models/Products';
import Reviews from '../../models/Reviews';
import { IProductReview } from '../../interfaces/product.interface';

export async function addReview(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const productId: string = req.params.id;
  const review: IProductReview = req.body;
  try {
    const savedReview = await Reviews.create({
      ...review,
      customer: new mongoose.Types.ObjectId(userId),
      product: new mongoose.Types.ObjectId(productId),
    }).then((res) => res.toJSON());

    if (!savedReview) return res.status(500).json(responseDto('Unable to add review'));

    await Products.updateOne(
      { _id: productId },
      {
        $addToSet: { usersReviewed: userId },
        $push: { productReviews: savedReview._id },
        $inc: {
          'productReviewOverview.ratingSum': review.rating,
          'productReviewOverview.totalReviews': 1,
        },
      }
    );

    res.status(200).json(savedReview);
  } catch (err) {
    res.status(400).json('could not save review');
  }
}

export async function getReviews(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = 5;

  try {
    const reviews = await Reviews.find({
      customer: new mongoose.Types.ObjectId(userId),
    })
      .populate('customer')
      .populate({
        path: 'product',
        select: 'name',
      })
      .limit(limit + 1)
      .skip((page - 1) * limit)
      .lean()
      .exec();

    const hasNext = reviews.length > limit && !!reviews.pop();

    res.status(200).json(responseDto(reviews, true, { hasNext, limit, current: page }));
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}
