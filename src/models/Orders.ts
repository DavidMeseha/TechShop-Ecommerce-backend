import mongoose from 'mongoose';

import { AttributeSchema } from './supDocumentsSchema';
import { IOrder } from '../interfaces/user.interface';

export interface IOrderDocument extends IOrder, mongoose.Document {}

const orderItemFields = {
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Products',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  attributes: [AttributeSchema],
};

const shippingFields = {
  shippingStatus: {
    type: String,
    default: 'Processing',
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
  },
  shippingAddress: {
    address: {
      type: String,
      required: true,
    },
    country: {
      type: mongoose.Schema.ObjectId,
      ref: 'Countries',
      required: true,
    },
    city: {
      type: mongoose.Schema.ObjectId,
      ref: 'Cities',
      required: true,
    },
  },
  shippingFees: {
    type: Number,
    required: true,
    min: 0,
  },
};

const billingFields = {
  billingMethod: {
    type: String,
    required: true,
    enum: ['card', 'cod', 'paypal'],
  },
  billingStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed'],
  },
};

const priceFields = {
  subTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  totalValue: {
    type: Number,
    required: true,
    min: 0,
  },
};

const orderFields = {
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: true,
    index: true,
  },
  items: [orderItemFields],
  ...shippingFields,
  ...billingFields,
  ...priceFields,
};

export const OrderSchema = new mongoose.Schema<IOrderDocument>(orderFields, {
  timestamps: true,
});

OrderSchema.index({ shippingStatus: 1 });
OrderSchema.index({ billingStatus: 1 });
OrderSchema.index({ createdAt: -1 });

const Orders =
  (mongoose.models.Orders as mongoose.Model<IOrderDocument>) ||
  mongoose.model<IOrderDocument>('Orders', OrderSchema);

export default Orders;
