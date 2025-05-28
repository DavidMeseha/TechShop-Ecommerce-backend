import Users from '@/models/Users';
import Products from '@/models/Products';
import Vendors from '@/models/Vendors';
import Categories from '@/models/Categories';
import Tags from '@/models/Tags';
import createUserCartAggregationPipeline from '@/pipelines/cart.aggregation';
import { IAddress, IUserCart } from '@/types/user.interface';
import { IPicture, ProductListItem } from '@/types/product.interface';
import { AppError } from '@/utils/appErrors';

type IGetUserCartReturn = {
  _id: string;
  cart: IUserCart<ProductListItem>[];
  addresses: IAddress[];
};

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
    .select('name _id seName pictures')
    .limit(limit)
    .lean<{ name: string; _id: string; pictures: IPicture[]; sename: string }[]>()
    .then((products) =>
      products.map((item) => ({
        item: { ...item, imageUrl: item.pictures[0].imageUrl },
        type: 'product',
      }))
    );
}

export async function findVendorsByName(regex: RegExp, limit: number) {
  return Vendors.find({ name: regex })
    .select('name seName _id imageUrl')
    .limit(limit)
    .lean<{ name: string; seName: string; imageUrl: string }[]>()
    .then((vendors) => vendors.map((item) => ({ item, type: 'vendor' })));
}

export async function findCategoriesByName(regex: RegExp, limit: number) {
  return Categories.find({ name: regex })
    .select('_id name seName')
    .limit(limit)
    .lean<{ name: string; seName: string; imageUrl: string }[]>()
    .then((category) => category.map((item) => ({ item, type: 'category' })));
}

export async function findTagsByName(regex: RegExp, limit: number) {
  return Tags.find({ name: regex })
    .select('_id name seName')
    .limit(limit)
    .lean<{ name: string; seName: string; imageUrl: string }[]>()
    .then((tag) => tag.map((item) => ({ item, type: 'tag' })));
}
