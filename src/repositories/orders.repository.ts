import Stripe from 'stripe';
import { STRIPE_SECRET } from '@/config/env.config';
import Users from '@/models/Users';
import { IAddress, IUser, IUserCart } from '@/types/user.interface';
import { ProductListItem } from '@/types/product.interface';
import Orders from '@/models/Orders';
import calculateCartValue from '@/utils/calculate-cart-value';
import { AppError } from '@/utils/appErrors';

interface NewOrderProps {
  billingMethod: string;
  shippingAddress: IAddress;
  cart: IUserCart<ProductListItem>[];
}

export async function createSripePayment(cart: IUserCart<ProductListItem>[]) {
  if (!STRIPE_SECRET) throw new AppError('Stripe secret key not configured', 500);

  const stripe = new Stripe(STRIPE_SECRET);
  const total = calculateCartValue(cart);

  return stripe.paymentIntents.create({
    amount: total * 100,
    currency: 'usd',
    payment_method_types: ['card'],
  });
}

export async function userOrderPalcementData(userId: string, shippingAddressId: string) {
  const user = await Users.findById(userId)
    .populate('cart.product')
    .lean<Pick<IUser, 'addresses' | '_id'> & { cart: IUserCart<ProductListItem>[] }>()
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
