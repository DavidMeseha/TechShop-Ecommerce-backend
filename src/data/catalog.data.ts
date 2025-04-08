import Products from '../models/Products';
import Vendors from '../models/Vendors';
import Tags from '../models/Tags';
import Categories from '../models/Categories';
import { ICategory, IFullProduct, ITag, IVendor } from '../interfaces/product.interface';
import createProductsAggregationPipeline from '../pipelines/products.pipeline';
import createProductPipeline from '../pipelines/singleProduct.pipeline';
import { Types } from 'mongoose';
import createVendorsAggregationPipeline from '../pipelines/vendors.pipeline';
import createSingleVendorAggregationPipeline from '../pipelines/singleVendor.pipeline';

interface PaginationResult<T> {
  data: T[];
  pagination: {
    hasNext: boolean;
    limit: number;
    current: number;
  };
}

async function findProducts(): Promise<IFullProduct[]> {
  return Products.find({}).exec();
}

async function findProductById(userId: string, productId: string) {
  const pipeline = createProductPipeline(userId, {
    $match: {
      _id: new Types.ObjectId(productId),
    },
  });
  const products = await Products.aggregate(pipeline).exec();
  return products[0] ?? null;
}

async function findProductsByVendor(userId: string, vendorId: string, page: number, limit: number) {
  const pipeline = createProductsAggregationPipeline(userId, page, limit, [
    {
      $match: {
        vendor: new Types.ObjectId(vendorId),
      },
    },
  ]);
  const products = await Products.aggregate(pipeline).exec();

  const hasNext = products.length > limit;
  if (hasNext) products.pop();

  return {
    data: products,
    pagination: { hasNext, limit, current: page },
  };
}

async function findProductsByTag(userId: string, tagId: string, page: number, limit: number) {
  const pipeline = createProductsAggregationPipeline(userId, page, limit, [
    {
      $match: {
        productTags: { $in: [new Types.ObjectId(tagId)] },
      },
    },
  ]);
  const products = await Products.aggregate(pipeline).exec();

  const hasNext = products.length > limit;
  if (hasNext) products.pop();

  return {
    data: products,
    pagination: { hasNext, limit, current: page },
  };
}

async function findProductsByCategory(
  userId: string,
  categoryId: string,
  page: number,
  limit: number
) {
  const pipeline = createProductsAggregationPipeline(userId, page, limit, [
    {
      $match: {
        category: { $in: [new Types.ObjectId(categoryId)] },
      },
    },
  ]);
  const products = await Products.aggregate(pipeline).exec();

  const hasNext = products.length > limit;
  if (hasNext) products.pop();

  return {
    data: products,
    pagination: { hasNext, limit, current: page },
  };
}

async function getHomeFeedProducts(
  page: number,
  limit: number,
  userId: string | undefined
): Promise<PaginationResult<IFullProduct>> {
  const pipeline = createProductsAggregationPipeline(userId ?? '', page, limit);
  const products = await Products.aggregate(pipeline).exec();

  const hasNext = products.length > limit;
  if (hasNext) products.pop();

  return {
    data: products,
    pagination: { hasNext, limit, current: page },
  };
}

async function findVendorBySeName(userId: string, seName: string): Promise<IVendor | null> {
  const pipeline = createSingleVendorAggregationPipeline(userId, { $match: { seName } });
  const vendors = await Vendors.aggregate(pipeline).exec();
  return vendors[0] ?? null;
}

async function findVendors(
  userId: string,
  page: number,
  limit: number
): Promise<PaginationResult<IVendor>> {
  const pipeline = createVendorsAggregationPipeline(userId, page, limit);
  const vendors = await Vendors.aggregate(pipeline).exec();

  const hasNext = vendors.length > limit;
  if (hasNext) vendors.pop();

  return {
    data: vendors,
    pagination: { hasNext, limit, current: page },
  };
}

async function findAllVendorSeNames(): Promise<Pick<IVendor, 'seName'>[]> {
  return Vendors.find({}).select('seName').lean();
}

async function findTagBySeName(seName: string): Promise<ITag | null> {
  return Tags.findOne({ seName }).lean();
}

async function findTags(page: number, limit: number): Promise<PaginationResult<ITag>> {
  const tags = await Tags.find({})
    .limit(limit + 1)
    .skip((page - 1) * limit)
    .lean();

  const hasNext = tags.length > limit;
  if (hasNext) tags.pop();

  return {
    data: tags,
    pagination: { hasNext, limit, current: page },
  };
}

async function findAllTagSeNames(): Promise<Pick<ITag, 'seName'>[]> {
  return Tags.find({}).select('seName').lean();
}

async function findCategoryBySeName(seName: string): Promise<ICategory | null> {
  return Categories.findOne({ seName }).lean();
}

async function findCategories(page: number, limit: number): Promise<PaginationResult<ICategory>> {
  const categories = await Categories.find({})
    .limit(limit + 1)
    .skip((page - 1) * limit)
    .lean();

  const hasNext = categories.length > limit;
  if (hasNext) categories.pop();

  return {
    data: categories,
    pagination: { hasNext, limit, current: page },
  };
}

async function findAllCategorySeNames(): Promise<Pick<ICategory, 'seName'>[]> {
  return Categories.find({}).select('seName').lean();
}

export default {
  findAllCategorySeNames,
  findAllTagSeNames,
  findAllVendorSeNames,
  findCategories,
  findCategoryBySeName,
  findProductById,
  findProducts,
  findProductsByCategory,
  findProductsByVendor,
  findVendors,
  getHomeFeedProducts,
  findTagBySeName,
  findTags,
  findVendorBySeName,
  findProductsByTag,
};
