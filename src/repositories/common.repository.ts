import Users from '../models/Users';
import Products from '../models/Products';
import Vendors from '../models/Vendors';
import Categories from '../models/Categories';
import Tags from '../models/Tags';
import createUserCartAggregationPipeline from '../pipelines/cart.aggregation';
import { IUserCart } from '../interfaces/user.interface';
import { IFullProduct } from '../interfaces/product.interface';
import { IAddress } from '../models/supDocumentsSchema';
import { AppError } from '../utils/appErrors';

type IGetUserCartReturn = { _id: string; cart: IUserCart<IFullProduct>[]; addresses: IAddress[] };

export async function getUserCart(userId: string) {
  const users = await Users.aggregate<IGetUserCartReturn>(
    createUserCartAggregationPipeline(userId)
  ).exec();

  const user = users[0];
  if (!user) throw new AppError('error finding user', 400);
  return user;
}

export async function findProductsByName(regex: RegExp, limit: number) {
  return Products.find({ name: regex })
    .limit(limit)
    .lean()
    .then((products) => products.map((item) => ({ item, type: 'product' })));
}

export async function findVendorsByName(regex: RegExp, limit: number) {
  return Vendors.find({ name: regex })
    .limit(limit)
    .lean()
    .then((vendors) => vendors.map((item) => ({ item, type: 'vendor' })));
}

export async function findCategoriesByName(regex: RegExp, limit: number) {
  return Categories.find({ name: regex })
    .limit(limit)
    .lean()
    .then((category) => category.map((item) => ({ item, type: 'category' })));
}

export async function findTagsByName(regex: RegExp, limit: number) {
  return Tags.find({ name: regex })
    .limit(limit)
    .lean()
    .then((tag) => tag.map((item) => ({ item, type: 'tag' })));
}
