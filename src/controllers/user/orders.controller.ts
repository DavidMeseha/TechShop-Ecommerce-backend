import { Request, Response } from 'express';
import { responseDto } from '../../utilities';
import Users from '../../models/Users';
import { IAddress } from '../../models/supDocumentsSchema';
import Orders from '../../models/Orders';
import Stripe from 'stripe';

const STRIPE_SECRET = process.env.STRIPE_SECRET;

export async function paymentIntent(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';

  try {
    if (!STRIPE_SECRET) {
      throw new Error('Stripe secret key not configured');
    }

    const foundUser = await Users.findById(userId).populate('cart.product').lean().exec();

    if (!foundUser) {
      return res.status(404).json(responseDto('User not found'));
    }

    const cart = foundUser.cart ?? [];
    const total = cart.reduce(
      (sum, item) =>
        typeof item.product === 'object' && 'price' in item.product
          ? sum + item.product.price.price * item.quantity
          : 0,
      25 // Base shipping fee
    );

    const stripe = new Stripe(STRIPE_SECRET);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    return res.status(200).json({ paymentSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return res.status(500).json(responseDto('Failed to create payment intent'));
  }
}

export async function placeOrder(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const order: {
    billingMethod: string;
    shippingAddressId: string;
  } = req.body;

  try {
    const foundUser = await Users.findById(userId).populate('cart.product').exec();
    if (!foundUser) throw new Error('No user Found');

    const cart = foundUser.cart ?? [];
    const userAddresses = foundUser.addresses as (IAddress & { _id: string })[];
    const shippingAddress = userAddresses.find(
      (address) => String(address._id) === order.shippingAddressId
    );

    let total = 0;
    for (const item of cart) {
      if (typeof item.product === 'object' && 'price' in item.product) {
        total += item.product.price.price * item.quantity;
      }
    }

    const createdOrder = await Orders.create({
      customer: userId,
      billingStatus: order.billingMethod === 'cod' ? 'pending' : 'paid',
      billingMethod: order.billingMethod,
      shippingAddress: shippingAddress,
      items: cart,
      subTotal: total,
      totalValue: total + 25,
      shippingFees: 25,
    });

    if (!createdOrder) throw new Error('Could not create Order');

    const userUpdate = await Users.findByIdAndUpdate(userId, {
      $push: { orders: createdOrder._id },
    });

    if (!userUpdate) throw new Error();

    res.status(200).json(createdOrder);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getOrders(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';

  try {
    const foundUser = await Users.findById(userId)
      .select('orders')
      .populate(
        // "orders orders.items.product orders.shippingAddress.country orders.shippingAddress.city"
        {
          path: 'orders',
          populate: 'items.product shippingAddress.country shippingAddress.city',
        }
      )
      .lean()
      .exec();
    if (!foundUser?.orders) throw new Error('Could not find User Orders');

    res.status(200).json(foundUser.orders);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export async function getOrder(req: Request, res: Response) {
  const userId = res.locals.user?._id ?? '';
  const orderId = req.params.id;

  try {
    const order = await Orders.findOne({ customer: userId, _id: orderId })
      .populate('customer items.product shippingAddress.country shippingAddress.city')
      .lean()
      .exec();
    if (!order) throw new Error('Could not find User Orders');

    res.status(200).json(order);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}
