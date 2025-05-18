import { Types } from 'mongoose';
import { IAddressDocument } from '../models/supDocumentsSchema';
import { IFullProduct, IProductAttribute, IVendor } from './product.interface';

export interface UserInfoBody {
  dateOfBirthDay: number;
  dateOfBirthMonth: number;
  dateOfBirthYear: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  imageUrl: string;
  phone: string;
}

export interface IUserTokenPayload {
  firstName: string;
  lastName: string;
  email: string;
  isLogin: boolean;
  isVendor: boolean;
  isRegistered: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  __v: number;
  iat?: number;
  exp?: number;
}

export interface IUserCart<T = string | IFullProduct> {
  product: T;
  quantity: number;
  attributes: IProductAttribute[];
}

export interface IUserDateOfBirth {
  day: number;
  month: number;
  year: number;
}

export interface IOrder {
  customer: IUser | Types.ObjectId;
  billingStatus: string;
  billingMethod: string;
  shippingAddress: IAddressDocument;
  shippingStatus: string;
  items: (OrderItem | Types.ObjectId)[];
  subTotal: number;
  totalValue: number;
  shippingFees: number;
}

interface OrderItem {
  product: IFullProduct;
  quantity: number;
  attributes: IProductAttribute[];
}

export interface IUser {
  // Profile information
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string | null;
  phone: string;
  gender: 'male' | 'female' | null;
  dateOfBirth?: IUserDateOfBirth | null;

  // User preferences
  language?: string;

  // Status flags
  isLogin?: boolean;
  isRegistered?: boolean;
  isVendor?: boolean;

  // Relations and collections
  saves?: (IFullProduct | Types.ObjectId)[];
  likes?: (IFullProduct | Types.ObjectId)[];
  following: (IVendor | Types.ObjectId)[];
  recentProducts?: (IFullProduct | Types.ObjectId)[];
  cart?: IUserCart[];
  addresses: IAddressDocument[];
  orders: (IOrder | Types.ObjectId)[];
}
