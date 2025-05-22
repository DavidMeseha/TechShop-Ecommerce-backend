import { Request, Response } from 'express';
import Users from '../../models/Users';
import {
  addToCart,
  cartProducts,
  productAttributes,
  removeFromCart,
} from '../../repositories/cart.repository';
import { getUserCart } from '../../repositories/common.repository';
import { AppError } from '../../utils/appErrors';
import calculateCartValue from '../../utils/calculate-cart-value';
import { mapAttributes, validateAttributes } from '../../utils/misc';

interface AddToCartBody {
  quantity: number;
  attributes: { _id: string; values: { _id: string }[] }[];
}

const CART_LIMIT = 10;

//add to cart
export async function addProductToCart(req: Request, res: Response) {
  const userId = res.locals.userId;
  const { id: productId } = req.params;
  const { quantity, attributes }: AddToCartBody = req.body;

  if (!quantity || !attributes) throw new AppError('quantity and attributes are required', 400);

  const user = await Users.findById(userId).select('cart.product').exec();
  if (user?.cart && user.cart.length >= CART_LIMIT)
    throw new AppError(`Cart limit of ${CART_LIMIT} reached`, 400);

  const productActualAttributes = await productAttributes(productId);
  if (!productActualAttributes) throw new AppError('Could not find product', 404);

  const validateProvidedAttributes = validateAttributes(attributes, productActualAttributes);
  if (!validateProvidedAttributes) throw new AppError('Invalid product attributes', 400);

  const mappedAttributes = mapAttributes(attributes, productActualAttributes);

  const addToCartState = await addToCart(userId, productId, mappedAttributes, quantity);
  if (addToCartState.isError) throw new AppError(addToCartState.message, 409);

  res.status(200).json({ success: true, message: 'product added to cat successfully' });
}

//remove from cart
export async function removeProductFromCart(req: Request, res: Response) {
  const userId = res.locals.userId;
  const productId: string = req.params.id;

  const [userUpdate, productUpdate] = await removeFromCart(userId, productId);
  if (!userUpdate.modifiedCount && !productUpdate.modifiedCount)
    throw new AppError('Product not found in cart', 409);

  res.status(200).json({ success: true, message: 'Product removed from cart successfully' });
}

export async function getCartProductsIds(req: Request, res: Response) {
  const userId = res.locals.userId;

  const userCart = await Users.findById(userId).select('cart.product').exec();
  const cart = userCart?.cart ?? [];

  res.status(200).json(cart.map((cartItem) => cartItem.product) ?? []);
}

//all cart products
export async function getCartProducts(req: Request, res: Response) {
  const userId = res.locals.userId;
  const products = await cartProducts(userId);
  res.status(200).json(products);
}

//all cart products with selected attributes
export async function getCartProductsWithAttributes(req: Request, res: Response) {
  const userId = res.locals.userId;
  const { cart } = await getUserCart(userId);
  res.status(200).json(cart);
}

//cart with data needed for checkout
export async function getCheckoutDetails(_req: Request, res: Response) {
  const userId = res.locals.userId;

  const { cart, addresses } = await getUserCart(userId);
  const total = calculateCartValue(cart);

  return res.status(200).json({
    cartItems: cart,
    addresses,
    total,
    currency: 'usd',
  });
}
