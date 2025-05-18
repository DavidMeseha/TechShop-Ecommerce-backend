import { Types } from 'mongoose';
import { IProductReview } from '../interfaces/product.interface';
import Reviews from '../models/Reviews';
import Products from '../models/Products';
import { isValidIdFormat } from '../utils/misc';
import { AppError } from '../utils/appErrors';

export async function createReview(userId: string, productId: string, review: IProductReview) {
  if (!isValidIdFormat(productId)) throw new AppError('productId is not a valid id', 400);

  const savedReview = await Reviews.create({
    ...review,
    customer: new Types.ObjectId(userId),
    product: new Types.ObjectId(productId),
  });

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

  return savedReview;
}
