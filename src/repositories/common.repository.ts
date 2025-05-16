import Users from '../models/Users';
import Products from '../models/Products';
import Vendors from '../models/Vendors';
import Categories from '../models/Categories';
import Tags from '../models/Tags';
import createUserCartAggregationPipeline from '../pipelines/cart.aggregation';
import { IUserCart } from '../interfaces/user.interface';
import { IFullProduct } from '../interfaces/product.interface';
import { IAddress } from '../models/supDocumentsSchema';

type IGetUserCartReturn = Promise<
  { _id: string; cart: IUserCart<IFullProduct>[]; addresses: IAddress[] } | undefined
>;

async function getUserCart(userId: string): IGetUserCartReturn {
  const user = await Users.aggregate<IGetUserCartReturn>(
    createUserCartAggregationPipeline(userId)
  ).exec();
  return user?.[0] || undefined;
}

async function findProductsByName(regex: RegExp, limit: number) {
  return Products.find({ name: regex })
    .limit(limit)
    .lean()
    .then((products) => products.map((item) => ({ item, type: 'product' })));
}

async function findVendorsByName(regex: RegExp, limit: number) {
  return Vendors.find({ name: regex })
    .limit(limit)
    .lean()
    .then((vendors) => vendors.map((item) => ({ item, type: 'vendor' })));
}

async function findCategoriesByName(regex: RegExp, limit: number) {
  return Categories.find({ name: regex })
    .limit(limit)
    .lean()
    .then((category) => category.map((item) => ({ item, type: 'category' })));
}

async function findTagsByName(regex: RegExp, limit: number) {
  return Tags.find({ name: regex })
    .limit(limit)
    .lean()
    .then((tag) => tag.map((item) => ({ item, type: 'tag' })));
}

export default {
  getUserCart,
  findProductsByName,
  findVendorsByName,
  findCategoriesByName,
  findTagsByName,
};
