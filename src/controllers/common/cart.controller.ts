import { Request, Response } from 'express';
import Users from '../../models/Users';
import {
  addToCart,
  cartProducts,
  removeFromCart,
  validateProductAndAttributes,
} from '../../repositories/cart.repository';
import { getUserCart } from '../../repositories/common.repository';
import { AppError } from '../../utils/appErrors';
import calculateCartValue from '../../utils/calculate-cart-value';

export async function addProductToCart(req: Request, res: Response) {
  const userId = res.locals.userId;
  const { id: productId } = req.params;
  const { quantity, attributes } = req.body;

  if (!productId || !quantity || !attributes)
    throw new AppError('productId, quantity and attributes are required', 400);

  const validProductAttributes = await validateProductAndAttributes(productId, attributes);
  if (!validProductAttributes) throw new AppError('Invalid product attributes', 400);

  const addToCartState = await addToCart(userId, productId, attributes, quantity);
  if (addToCartState.isError) throw new AppError(addToCartState.message, 409);

  res.status(200).json('product added to cat successfully');
}

export async function removeProductFromCart(req: Request, res: Response) {
  const userId = res.locals.userId;
  const productId: string = req.params.id;

  const [userUpdate, productUpdate] = await removeFromCart(userId, productId);
  if (!userUpdate.modifiedCount && !productUpdate.modifiedCount)
    return res.status(409).json({ message: 'Product not found in cart' });

  res.status(200).json('Product removed from cart successfully');
}

export async function getCartProductsIds(req: Request, res: Response) {
  const userId = res.locals.userId;

  const userCart = await Users.findById(userId).select('cart.product').exec();
  const cart = userCart?.cart ?? [];

  res.status(200).json(cart.map((cartItem) => cartItem.product) ?? []);
}

export async function getCartProducts(req: Request, res: Response) {
  const userId = res.locals.userId;
  const products = await cartProducts(userId);
  res.status(200).json(products);
}

export async function getCartProductsWithAttributes(req: Request, res: Response) {
  const userId = res.locals.userId;
  const { cart } = await getUserCart(userId);
  res.status(200).json(cart);
}

export async function getCheckoutDetails(_req: Request, res: Response) {
  const userId = res.locals.userId;

  const { cart, addresses } = await getUserCart(userId);
  const total = calculateCartValue(cart);

  return res.status(200).json({
    cartItems: cart,
    addresses,
    total,
  });
}
