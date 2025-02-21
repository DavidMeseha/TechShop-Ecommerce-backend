import { Types } from 'mongoose';
import { IUserCart } from '../interfaces/user.interface';
import Reviews, { IProductReviewDocument } from '../models/Reviews';
import Users from '../models/Users';
import { IProductAttributeDocument } from '../models/supDocumentsSchema';
import { addToCart, alreadyInCart, validateProductAndAttributes } from './addToCart.data';
import Products from '../models/Products';
import Vendors from '../models/Vendors';
import Categories from '../models/Categories';
import Tags from '../models/Tags';

interface UserActions {
  reviews: Pick<IProductReviewDocument, '_id'>[];
  cart: IUserCart[];
  likes: Types.ObjectId[];
  saves: Types.ObjectId[];
  follows: Types.ObjectId[];
}

async function getUserCart(id: string) {
  return Users.findById(id).select('cart addresses').populate('cart.product').lean();
}

async function addProductToUserCart(
  userId: string,
  productId: string,
  attributes: IProductAttributeDocument[],
  quantity: number
) {
  const existingCartItem = await alreadyInCart(userId, productId);
  if (existingCartItem) return { isError: true, message: 'Product already exists in cart' };
  const validProduct = await validateProductAndAttributes(productId, attributes);
  if (!validProduct) return { isError: true, message: 'Product or attributes not valid' };
  return await addToCart(userId, productId, attributes, quantity);
}

async function allUserActions(userId: string): Promise<UserActions | undefined> {
  const [foundUser, reviews] = await Promise.all([
    Users.findById(userId)
      .lean<{
        likes: Types.ObjectId[];
        saves: Types.ObjectId[];
        following: Types.ObjectId[];
        cart: IUserCart[];
      }>()
      .exec(),
    Reviews.find({ customer: userId }).select('_id').lean<{ _id: string }[]>().exec(),
  ]);

  if (foundUser)
    return {
      reviews: reviews ?? [],
      cart: foundUser.cart ?? [],
      likes: foundUser.likes ?? [],
      saves: foundUser.saves ?? [],
      follows: foundUser.following ?? [],
    };
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
  allUserActions,
  addProductToUserCart,
  getUserCart,
  findProductsByName,
  findVendorsByName,
  findCategoriesByName,
  findTagsByName,
};
