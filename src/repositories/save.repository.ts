import Products from '@/models/Products';
import { AppError } from '@/utils/appErrors';
import { isValidIdFormat } from '@/utils/misc';

export async function save(userId: string, productId: string) {
  if (!isValidIdFormat(productId)) throw new AppError('productId is not a valid id', 400);

  const productUpdate = await Products.updateOne(
    { _id: productId, usersSaved: { $ne: userId } },
    { $inc: { saves: 1 }, $addToSet: { usersSaved: userId } }
  );

  return productUpdate;
}

export async function unsave(userId: string, productId: string) {
  if (!isValidIdFormat(productId)) throw new AppError('productId is not a valid id', 400);

  const productUpdate = await Products.updateOne(
    { _id: productId, usersSaved: { $eq: userId } },
    { $inc: { saves: -1 }, $pull: { usersSaved: userId } }
  );

  return productUpdate;
}
