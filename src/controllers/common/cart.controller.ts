import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { responseDto } from '../../utilities';
import Products from '../../models/Products';
import Users from '../../models/Users';
import { addToCart, validateProductAndAttributes } from '../../data/addToCart.data';
import db from '../../data/common.data';
import createProductsAggregationPipeline from '../../pipelines/products.pipeline';

export async function addProductToCart(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const { id: productId } = req.params;
  const { quantity, attributes } = req.body;

  if (!productId) return res.status(400).json(responseDto('Product ID is required'));

  try {
    const validProductAttributes = await validateProductAndAttributes(productId, attributes);
    if (!validProductAttributes)
      return res.status(400).json(responseDto('Invalid product attributes'));

    const addToCartState = await addToCart(userId, productId, attributes, quantity);
    if (addToCartState.isError) return res.status(409).json(responseDto(addToCartState.message));

    return res.status(200).json(responseDto('product added to cat successfully', true));
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).json(responseDto('Failed to add product to cart'));
  }
}

export async function removeProductFromCart(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const productId: string = req.params.id;

  if (!productId) return res.status(400).json(responseDto('Product ID is required'));

  try {
    const [userUpdate, productUpdate] = await Promise.all([
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

    if (!userUpdate.modifiedCount && !productUpdate.modifiedCount)
      return res.status(409).json({ message: 'Product not found in cart' });

    return res.status(200).json(responseDto('Product removed from cart successfully', true));
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCartProductsIds(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';

  try {
    const userCart = await Users.findById(userId).select('cart.product').exec();
    const cart = userCart?.cart ?? [];

    res.status(200).json(cart.map((cartItem) => cartItem.product) ?? []);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCartProducts(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const pipeline = createProductsAggregationPipeline(userId, 1, 20, [
    {
      $match: {
        usersCarted: userId,
      },
    },
  ]);

  try {
    const cartProdcuts = await Products.aggregate(pipeline);
    res.status(200).json(cartProdcuts);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getCartProductsWithAttributes(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';

  try {
    const foundUser = await db.getUserCart(userId);
    if (!foundUser) return res.status(400).json(responseDto('User not found'));

    const cart = foundUser.cart;
    res.status(200).json(cart);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}
