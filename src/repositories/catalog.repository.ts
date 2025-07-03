import Products from '@/models/Products';
import Vendors from '@/models/Vendors';
import Tags from '@/models/Tags';
import Categories from '@/models/Categories';
import {
  ICategory,
  IFullProduct,
  ITag,
  IVendor,
  ProductActions,
  ProductListItem,
} from '@/types/product.interface';
import createProductsAggregationPipeline from '@/pipelines/products.aggregation';
import createProductPipeline from '@/pipelines/product.aggregation';
import { Types } from 'mongoose';
import createVendorsPipeline from '@/pipelines/vendors.aggregation';
import createVendorPipeline from '@/pipelines/vendor.aggregation';
import { isValidIdFormat } from '@/utils/misc';
import { AppError } from '@/utils/appErrors';

export async function findProductById(userId: string, productId: string) {
  if (!isValidIdFormat(productId)) throw new AppError('productId is not a valid id', 400);

  const pipeline = createProductPipeline(userId, {
    $match: {
      _id: new Types.ObjectId(productId),
    },
  });
  const products = await Products.aggregate(pipeline).exec();
  return products[0] ?? null;
}

export async function findProductBySeName(userId: string, seName: string) {
  const pipeline = createProductPipeline(userId, { $match: { seName } });
  const products = await Products.aggregate<IFullProduct & ProductActions>(pipeline).exec();
  return products[0] ?? null;
}

export async function findProductsByVendor(
  userId: string,
  vendorId: string,
  page: number,
  limit: number
) {
  const pipeline = createProductsAggregationPipeline(userId, page, limit, [
    {
      $match: {
        vendor: new Types.ObjectId(vendorId),
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
  const products = await Products.aggregate<ProductListItem[]>(pipeline).exec();

  const hasNext = products.length > limit;
  if (hasNext) products.pop();

  return {
    data: products,
    pagination: { hasNext, limit, current: page },
  };
}

export async function findProductsByTag(
  userId: string,
  tagSeName: string,
  page: number,
  limit: number
) {
  const pipeline = createProductsAggregationPipeline(userId, page, limit, [
    {
      $match: {
        productTags: { $in: [tagSeName] },
      },
    },
  ]);
  const products = await Products.aggregate<ProductListItem[]>(pipeline).exec();

  const hasNext = products.length > limit;
  if (hasNext) products.pop();

  return {
    data: products,
    pagination: { hasNext, limit, current: page },
  };
}

export async function findProductsByCategory(
  userId: string,
  categoryId: string,
  page: number,
  limit: number
) {
  if (!isValidIdFormat(categoryId)) throw new AppError('categoryId is not a valid id', 400);

  const pipeline = createProductsAggregationPipeline(userId, page, limit, [
    {
      $match: {
        category: { $in: [new Types.ObjectId(categoryId)] },
      },
    },
  ]);
  const products = await Products.aggregate<ProductListItem[]>(pipeline).exec();

  const hasNext = products.length > limit;
  if (hasNext) products.pop();

  return {
    data: products,
    pagination: { hasNext, limit, current: page },
  };
}

export async function getHomeFeedProducts(page: number, limit: number, userId: string) {
  const pipeline = createProductsAggregationPipeline(userId, page, limit, [
    {
      $project: {
        productAttributes: 0,
        productReviews: 0,
      },
    },
  ]);
  const products = await Products.aggregate<ProductListItem>(pipeline).exec();

  const hasNext = products.length > limit;
  if (hasNext) products.pop();

  return {
    data: products,
    pagination: { hasNext, limit, current: page },
  };
}

export async function findVendorBySeName(userId: string, seName: string) {
  const pipeline = createVendorPipeline(userId, [{ $match: { seName } }]);
  const vendors = await Vendors.aggregate(pipeline).exec();
  return vendors[0] ?? null;
}

export async function findVendors(userId: string, page: number, limit: number) {
  const pipeline = createVendorsPipeline(userId, page, limit);
  const vendors = await Vendors.aggregate<IVendor[]>(pipeline).exec();

  const hasNext = vendors.length > limit;
  if (hasNext) vendors.pop();

  return {
    data: vendors,
    pagination: { hasNext, limit, current: page },
  };
}

export async function findAllVendorSeNames() {
  return Vendors.find({}).select('seName').lean<Pick<IVendor, 'seName'>[]>();
}

export async function findTagBySeName(seName: string) {
  return Tags.findOne({ seName }).lean<ITag>();
}

export async function findTags(page: number, limit: number) {
  const tags = await Tags.find({})
    .limit(limit + 1)
    .skip((page - 1) * limit)
    .lean<ITag[]>();

  const hasNext = tags.length > limit;
  if (hasNext) tags.pop();

  return {
    data: tags,
    pagination: { hasNext, limit, current: page },
  };
}

export async function findAllTagSeNames() {
  return Tags.find({}).select('seName').lean<Pick<ITag, 'seName'>[]>();
}

export async function findCategoryBySeName(seName: string) {
  return Categories.findOne({ seName }).lean<ICategory>();
}

export async function findCategories(page: number, limit: number) {
  const categories = await Categories.find({})
    .limit(limit + 1)
    .skip((page - 1) * limit)
    .lean<ICategory[]>();

  const hasNext = categories.length > limit;
  if (hasNext) categories.pop();

  return {
    data: categories,
    pagination: { hasNext, limit, current: page },
  };
}

export async function findAllCategorySeNames(): Promise<Pick<ICategory, 'seName'>[]> {
  return Categories.find({}).select('seName').lean<Pick<ICategory, 'seName'>[]>();
}
