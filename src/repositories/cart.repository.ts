import { Types } from 'mongoose';
import Products from '../models/Products';
import Users from '../models/Users';
import { validateAttributes } from '../utils/misc';
import { IProductAttributeDocument } from '../models/supDocumentsSchema';
import { IProductAttribute } from '../interfaces/product.interface';
import { IFullProduct } from '../interfaces/product.interface';
import { IUserCart } from '../interfaces/user.interface';
import createProductsPipeline from '../pipelines/products.aggregation';
import { AppError } from '../utils/appErrors';

export async function validateProductAndAttributes(
  id: string,
  attributes: IProductAttributeDocument[]
) {
  const product = await Products.findById(id)
    .select('productAttributes')
    .lean<{ productAttributes: IProductAttributeDocument[] }>()
    .exec();

  if (!product) return false;
  return validateAttributes(attributes, product.productAttributes);
}

export async function addToCart(
  userId: string,
  productId: string,
  attributes: IProductAttribute[],
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
  ]);

  const products = await Products.aggregate<IFullProduct>(pipeline);

  return products;
}
