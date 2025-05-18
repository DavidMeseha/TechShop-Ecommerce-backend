import { Types } from 'mongoose';
import { IFullProduct } from '../interfaces/product.interface';
import Products from '../models/Products';
import Reviews, { IProductReviewDocument } from '../models/Reviews';
import createProductPipeline from '../pipelines/product.aggregation';
import { AppError } from '../utils/appErrors';
import { isValidIdFormat } from '../utils/misc';

export async function productAttributes(seName: string) {
  const products = await Products.find({ seName })
    .select('productAttributes name hasAttributes seName')
    .lean<Pick<IFullProduct, 'productAttributes' | 'name' | 'seName' | 'hasAttributes'>[]>()
    .exec();

  return products[0] ?? null;
}

export async function productDetails(userId: string, seName?: string) {
  const pipeline = createProductPipeline(userId, { $match: { seName } });
  const products = await Products.aggregate<IFullProduct>(pipeline).exec();
  return products[0] ?? null;
}

export async function productReviews(productId: string) {
  if (!isValidIdFormat(productId)) throw new AppError('productId is not a valid id', 400);

  const reviews = await Reviews.find({
    product: new Types.ObjectId(productId),
  })
    .populate({
      path: 'customer',
      select: 'firstName lastName imageUrl',
    })
    .lean<IProductReviewDocument>()
    .exec();

  return reviews;
}
