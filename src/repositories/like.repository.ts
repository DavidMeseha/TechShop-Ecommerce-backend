import Products from '../models/Products';
import createProductPipeline from '../pipelines/product.aggregation';
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

export async function likedProducts(userId: string) {
  const pipline = createProductPipeline(userId, {
    $match: {
      usersLiked: userId,
    },
  });

  return Products.aggregate(pipline).exec();
}
