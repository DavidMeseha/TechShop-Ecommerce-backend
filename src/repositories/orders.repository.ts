import Stripe from 'stripe';
import { STRIPE_SECRET } from '../config/env.config';
import Users, { IUserDocument } from '../models/Users';
import { IUserCart } from '../interfaces/user.interface';
import { IFullProduct } from '../interfaces/product.interface';
import Orders from '../models/Orders';
import { IAddressDocument } from '../models/supDocumentsSchema';
import calculateCartValue from '../utils/calculate-cart-value';
import { AppError } from '../utils/appErrors';

interface NewOrderProps {
  billingMethod: string;
  shippingAddress: IAddressDocument;
  cart: IUserCart<IFullProduct>[];
}

export async function createSripePayment(cart: IUserCart<IFullProduct>[]) {
  if (!STRIPE_SECRET) throw new AppError('Stripe secret key not configured', 500);

  const stripe = new Stripe(STRIPE_SECRET);
  const total = calculateCartValue(cart);

  return stripe.paymentIntents.create({
    amount: total * 100, // Convert to cents
    currency: 'usd',
    payment_method_types: ['card'],
  });
}

export async function userOrderPalcementData(userId: string, shippingAddressId: string) {
  const user = await Users.findById(userId)
    .populate('cart.product')
    .lean<Pick<IUserDocument, 'addresses' | '_id'> & { cart: IUserCart<IFullProduct>[] }>()
    .exec();

  if (!user) throw new AppError('error Getting user', 500);

  const shippingAddress = user.addresses.find(
    (address) => String(address._id) === shippingAddressId
  );

  if (!shippingAddress) throw new AppError('Address was not found in users addresses', 422);

  return { shippingAddress, cart: user.cart };
}

export async function createOrder(userId: string, order: NewOrderProps) {
  const total = calculateCartValue(order.cart);

  const createdOrder = await Orders.create({
    customer: userId,
    billingStatus: order.billingMethod === 'cod' ? 'pending' : 'paid',
    billingMethod: order.billingMethod,
    shippingAddress: order.shippingAddress,
    items: order.cart,
    subTotal: total,
    totalValue: total + 25 + (order.billingMethod === 'cod' ? 10 : 0),
    shippingFees: 25,
    codFees: order.billingMethod === 'cod' ? 10 : 0,
  });

  await Users.findByIdAndUpdate(userId, {
    $push: { orders: createdOrder._id },
  });

  return createdOrder;
}
