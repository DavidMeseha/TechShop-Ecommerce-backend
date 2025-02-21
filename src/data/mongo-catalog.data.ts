import Products from '../models/Products';
import Vendors from '../models/Vendors';
import Tags from '../models/Tags';
import Categories from '../models/Categories';
import { ICategory, IFullProduct, ITag, IVendor } from '../interfaces/product.interface';

interface PaginationResult<T> {
  data: T[];
  pagination: {
    hasNext: boolean;
    limit: number;
    current: number;
  };
}

async function findProducts(): Promise<IFullProduct[]> {
  return Products.find({}).lean();
}

async function findProductById(id: string): Promise<IFullProduct | null> {
  return Products.findById(id)
    .populate({ path: 'vendor', select: '_id name imageUrl seName' })
    .populate('productTags')
    .populate({
      path: 'productReviews',
      select: 'product customer reviewText rating',
      populate: 'customer',
    })
    .lean();
}

async function findProductsByVendor(
  vendorId: string,
  page: number,
  limit: number
): Promise<PaginationResult<IFullProduct>> {
  const products = await Products.find({ vendor: vendorId })
    .populate('vendor productTags')
    .limit(limit + 1)
    .skip((page - 1) * limit)
    .lean();

  const hasNext = products.length > limit;
  if (hasNext) products.pop();

  return {
    data: products,
    pagination: { hasNext, limit, current: page },
  };
}

async function findProductsByTag(
  tagId: string,
  page: number,
  limit: number
): Promise<PaginationResult<IFullProduct>> {
  const products = await Products.find({ productTags: tagId })
    .populate('productTags vendor')
    .limit(limit + 1)
    .skip((page - 1) * limit)
    .lean();

  const hasNext = products.length > limit;
  if (hasNext) products.pop();

  return {
    data: products,
    pagination: { hasNext, limit, current: page },
  };
}

async function findProductsByCategory(
  categoryId: string,
  page: number,
  limit: number
): Promise<PaginationResult<IFullProduct>> {
  const products = await Products.find({ category: categoryId })
    .populate('productTags vendor')
    .limit(limit + 1)
    .skip((page - 1) * limit)
    .lean();

  const hasNext = products.length > limit;
  if (hasNext) products.pop();

  return {
    data: products,
    pagination: { hasNext, limit, current: page },
  };
}

async function getHomeFeedProducts(
  page: number,
  limit: number
): Promise<PaginationResult<IFullProduct>> {
  const products = await Products.find({})
    .populate('vendor productTags')
    .limit(limit + 1)
    .skip((page - 1) * limit)
    .lean();

  const hasNext = products.length > limit;
  if (hasNext) products.pop();

  return {
    data: products,
    pagination: { hasNext, limit, current: page },
  };
}

async function findVendorBySeName(seName: string): Promise<IVendor | null> {
  return Vendors.findOne({ seName }).lean();
}

async function findVendors(page: number, limit: number): Promise<PaginationResult<IVendor>> {
  const vendors = await Vendors.find({})
    .limit(limit + 1)
    .skip((page - 1) * limit)
    .lean();

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
