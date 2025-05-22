import { Types } from 'mongoose';
import Products from '../models/Products';
import Users from '../models/Users';
import { IFullProduct, IProductAttribute } from '../interfaces/product.interface';
import { IUserCart } from '../interfaces/user.interface';
import createProductsPipeline from '../pipelines/products.aggregation';
import { AppError } from '../utils/appErrors';
import { isValidIdFormat } from '../utils/misc';

export async function productAttributes(id: string) {
  if (!isValidIdFormat(id)) throw new AppError('productId is not a valid id', 400);

  const product = await Products.findById(id)
    .select('productAttributes')
    .lean<{ productAttributes: (IProductAttribute & { _id: string })[] }>()
    .exec();

  return product?.productAttributes || undefined;
}

export async function addToCart(
  userId: string,
  productId: string,
  attributes: (IProductAttribute & { _id: string })[],
  quantity: number
) {
  const productUpdate = await Products.updateOne(
    { _id: productId, usersCarted: { $ne: userId } },
    { $inc: { carts: 1 }, $push: { usersCarted: userId } }
  );

  if (productUpdate.modifiedCount > 0) {
    const _updateUserCart = await Users.updateOne(
      { _id: userId },
      {
        $push: {
          cart: {
            product: new Types.ObjectId(productId),
            quantity,
            attributes,
          },
        },
      }
    );
  } else
    return { isError: true, message: 'Failed to add product to cart, it might be already added' };

  return { isError: false, message: 'Product added to cart' };
}

export async function userCart(userId: string) {
  const user = await Users.findById(userId)
    .select('cart')
    .populate('cart.product')
    .lean<{ cart: IUserCart<IFullProduct>[] }>()
    .exec();
  return user?.cart;
}

export async function removeFromCart(userId: string, productId: string) {
  if (!Types.ObjectId.isValid(productId)) throw new AppError('Product ID is not valid', 400);

  return Promise.all([
    Users.updateOne(
      {
        _id: userId,
        cart: {
          $elemMatch: { product: new Types.ObjectId(productId) },
        },
      },
      {
        $pull: { cart: { product: new Types.ObjectId(productId) } },
      }
    ),
    Products.updateOne(
      { _id: productId, usersCarted: { $eq: userId } },
      { $inc: { carts: -1 }, $pull: { usersCarted: userId } }
    ).exec(),
  ]);
}

export async function cartProducts(userId: string) {
  const pipeline = createProductsPipeline(userId, 1, 20, [
    {
      $match: {
        usersCarted: userId,
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

  const products = await Products.aggregate<IFullProduct>(pipeline);

  return products;
}
