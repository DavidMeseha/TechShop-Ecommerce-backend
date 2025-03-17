import { Request, Response } from 'express';
import { responseDto } from '../../utilities';
import db from '../../data/common.data';

export async function getCheckoutDetails(_req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';

  try {
    const foundUser = await db.getUserCart(userId);
    if (!foundUser) return res.status(404).json(responseDto('User not found'));

    const cart = foundUser.cart ?? [];
    const total = cart.reduce(
      (sum, item) => ('price' in item.product ? sum + item.product.price.price * item.quantity : 0),
      0
    );

    return res.status(200).json({
      addresses: foundUser.addresses,
      cartItems: cart,
      total,
    });
  } catch (error) {
    console.error('Error getting checkout details:', error);
    return res.status(500).json(responseDto('Failed to get checkout details'));
  }
}
