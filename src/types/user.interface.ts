import { IFullProduct, IProductAttribute, IVendor } from './product.interface';
import { ICity, ICountry, ObjectIdType } from './general';

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
  isVendor: boolean;
  isRegistered: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  iat?: number;
  exp?: number;
}

export interface IAddress<City = ICity, Country = ICountry> {
  _id: ObjectIdType;
  address: string;
  city: City;
  country: Country;
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
  _id: ObjectIdType;
  customer: IUser | ObjectIdType;
  billingStatus: string;
  billingMethod: string;
  shippingAddress: IAddress | ObjectIdType;
  shippingStatus: string;
  items: (OrderItem | ObjectIdType)[];
  subTotal: number;
  totalValue: number;
  shippingFees: number;
  codFees: number;
}

interface OrderItem {
  product: IFullProduct;
  quantity: number;
  attributes: IProductAttribute[];
}

export interface IUser {
  _id: ObjectIdType;

  // Profile information
  imageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  phone: string;
  gender: 'male' | 'female' | null;
  dateOfBirth: IUserDateOfBirth | null;

  // User preferences
  language: string;

  // Status flags
  isLogin: boolean;
  isRegistered: boolean;
  isVendor: boolean;

  // Relations and collections
  saves: (IFullProduct | ObjectIdType)[];
  likes: (IFullProduct | ObjectIdType)[];
  following: (IVendor | ObjectIdType)[];
  recentProducts: (IFullProduct | ObjectIdType)[];
  cart: IUserCart[];
  addresses: IAddress[];
  orders: (IOrder | ObjectIdType)[];
}
