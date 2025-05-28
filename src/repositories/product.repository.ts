import { Types } from 'mongoose';
import { IFullProduct, IProductReview } from '@/types/product.interface';
import Products from '@/models/Products';
import Reviews from '@/models/Reviews';
import createProductPipeline from '@/pipelines/product.aggregation';

export async function productAttributes(seName: string) {
  const products = await Products.find({ seName })
    .select('productAttributes name hasAttributes seName stock')
    .lean<
      Pick<IFullProduct, 'productAttributes' | 'name' | 'seName' | 'hasAttributes' | 'stock'>[]
    >()
    .exec();

  return products[0] ?? null;
}

export async function productDetails(userId: string, seName?: string) {
  const pipeline = createProductPipeline(userId, { $match: { seName } });
  const products = await Products.aggregate<IFullProduct>(pipeline).exec();
  return products[0] ?? null;
}

export async function productReviews(productId: string) {
  const reviews = await Reviews.find({
    product: new Types.ObjectId(productId),
  })
    .populate({
      path: 'customer',
      select: 'firstName lastName imageUrl',
    })
    .lean<IProductReview>()
    .exec();

  return reviews;
}
