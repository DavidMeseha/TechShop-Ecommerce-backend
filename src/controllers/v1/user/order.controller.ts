import { Request, Response } from 'express';
import { AppError } from '@/utils/appErrors';
import Orders from '@/models/Orders';
import { cartAvilabilityCheck, isValidIdFormat } from '@/utils/misc';
import { orderDetails, userOrders } from '@/repositories/user.repository';
import { userCart } from '@/repositories/cart.repository';
import {
  createOrder,
  createSripePayment,
  userOrderPalcementData,
} from '@/repositories/orders.repository';

export async function placeOrder(req: Request, res: Response) {
  const userId = res.locals.userId;

  const order: {
    billingMethod?: 'card' | 'cod';
    shippingAddressId?: string;
    paymentId?: string;
  } = req.body;

  if (!order.billingMethod || !order.shippingAddressId)
    throw new AppError('You need to Provide billing method and Shipping address', 400);

  if (order.billingMethod === 'card' && !order.paymentId)
    throw new AppError('payment intent id not provided', 400);

  const { shippingAddress, cart } = await userOrderPalcementData(userId, order.shippingAddressId);

  const errors = cartAvilabilityCheck(cart);
  if (errors.length > 0) throw new AppError('some products not in stock/not-avilable', 422);

  const createdOrder = await createOrder(userId, {
    billingMethod: order.billingMethod,
    shippingAddress,
    cart,
  });

  res.status(201).json({ success: true, _id: createdOrder._id });
}

export async function getOrders(req: Request, res: Response) {
  const userId = res.locals.userId;
  const page = parseInt(req.query.page?.toString() ?? '1');
  const limit = parseInt(req.query.limit?.toString() ?? '20');

  const orders = await userOrders(userId, { page, limit });
  res.status(200).json(orders);
}

export async function getOrder(req: Request, res: Response) {
  const userId = res.locals.userId;
  const orderId = req.params.id;

  const order = await orderDetails(userId, orderId);
  res.status(200).json(order);
}

export async function paymentIntent(req: Request, res: Response) {
  const userId = res.locals.userId;

  const cart = await userCart(userId);
  if (!cart) throw new AppError('error getting user', 500);

  const errors = cartAvilabilityCheck(cart);
  if (errors.length > 0) throw new AppError('some products not in stock', 422);

  const paymentIntent = await createSripePayment(cart);
  res.status(200).json({ paymentSecret: paymentIntent.client_secret });
}

export async function cancelOrder(req: Request, res: Response) {
  const userId = res.locals.userId;
  const orderId = req.params.id;
  if (!isValidIdFormat(orderId)) throw new AppError('orderId is not valid', 400);

  const orderUpdate = await Orders.updateOne(
    { _id: orderId, customer: userId },
    { shippingStatus: 'cancelled', billingStatus: 'cancelled' }
  );

  if (orderUpdate.modifiedCount === 0)
    throw new AppError('This feature is not implemented yet', 500);

  res.status(200).json({ success: true, message: 'Order cancelled' });
}
