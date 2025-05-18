import { Request, Response } from 'express';
import { userCart } from '../../repositories/cart.repository';
import {
  createOrder,
  createSripePayment,
  userOrderPalcementData,
} from '../../repositories/orders.repository';
import { orderDetails, userOrders } from '../../repositories/user.repository';
import { AppError } from '../../utils/appErrors';

export async function paymentIntent(req: Request, res: Response) {
  const userId = res.locals.userId;

  const cart = await userCart(userId);
  if (!cart) throw new AppError('error getting user', 500);

  const paymentIntent = await createSripePayment(cart);
  res.status(200).json({ paymentSecret: paymentIntent.client_secret });
}

export async function placeOrder(req: Request, res: Response) {
  const userId = res.locals.userId;

  const order: {
    billingMethod?: string;
    shippingAddressId?: string;
  } = req.body;

  if (!order.billingMethod || !order.shippingAddressId)
    throw new AppError('You need to Provide billing method and Shipping address', 400);

  const { shippingAddress, cart } = await userOrderPalcementData(userId, order.shippingAddressId);

  const createdOrder = await createOrder(userId, {
    billingMethod: order.billingMethod,
    shippingAddress,
    cart,
  });

  res.status(200).json(createdOrder);
}

export async function getOrders(req: Request, res: Response) {
  const userId = res.locals.userId;
  const orders = userOrders(userId);
  res.status(200).json(orders);
}

export async function getOrder(req: Request, res: Response) {
  const userId = res.locals.userId;
  const orderId = req.params.id;
  if (!orderId) throw new AppError('orderId is Required', 400);

  const order = await orderDetails(userId, orderId);
  res.status(200).json(order);
}
