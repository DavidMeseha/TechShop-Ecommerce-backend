import { IFullProduct } from '../interfaces/product.interface';
import Products from '../models/Products';
import createProductsPipeline from '../pipelines/products.aggregation';
import { AppError } from '../utils/appErrors';
import { isValidIdFormat } from '../utils/misc';

export function like(userId: string, productId: string) {
  if (!isValidIdFormat(productId)) throw new AppError('productId is not a valid id', 400);

  return Products.updateOne(
    { _id: productId, usersLiked: { $ne: userId } },
    { $inc: { likes: 1 }, $push: { usersLiked: userId } }
  );
}

export async function unLike(userId: string, productId: string) {
  if (!isValidIdFormat(productId)) throw new AppError('productId is not a valid id', 400);

  return Products.updateOne(
    { _id: productId, usersLiked: { $eq: userId } },
    { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
  );
}

export async function likedProducts(
  userId: string,
  { page, limit }: { page: number; limit: number }
) {
  const pipline = createProductsPipeline(userId, page, limit, [
    {
      $match: {
        usersLiked: userId,
      },
    },
    {
      $project: {
        productAttributes: 0,
        productReviews: 0,
        fullDescription: 0,
      },
    },
  ]);

  return Products.aggregate<
    Omit<
      IFullProduct,
      | 'productAttributes'
      | 'productReviews'
      | 'usersSaved'
      | 'usersLiked'
      | 'usersCarted'
      | 'usersReviewed'
    >[]
  >(pipline).exec();
}
