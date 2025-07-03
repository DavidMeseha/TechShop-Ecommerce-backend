import { ObjectId } from 'mongoose';
import { IUser } from './user.interface';

export interface ICategory {
  _id: ObjectId;
  name: string;
  seName: string;
  productsCount?: number;
}

export interface IPicture {
  _id: ObjectId;
  imageUrl: string;
  title: string;
  alternateText: string;
}

export interface IPrice {
  oldPrice: number;
  price: number;
}

export interface IProductAttribute {
  _id: ObjectId;
  name: string;
  attributeControlType: string;
  values: IProductAttributeValue[];
}

export interface IProductAttributeValue {
  _id: ObjectId;
  name: string;
  colorSquaresRgb?: string;
  imageSquaresPicture?: {
    imageUrl: string;
    title: string;
    alternateText: string;
  };
  priceAdjustmentValue?: number;
}

export interface IProductReview {
  _id: ObjectId;
  product: IFullProduct;
  customer: IUser;
  reviewText: string;
  rating: number;
}

export interface IVendor {
  _id: ObjectId;
  name: string;
  seName: string;
  imageUrl: string;
  productCount: number;
  followersCount: number;
  user: IUser;
}

export interface ITag {
  _id: ObjectId;
  name: string;
  seName: string;
  productCount: number;
}

export interface IFullProduct<Category = ICategory, Review = IProductReview, Vendor = IVendor> {
  _id: ObjectId;
  usersSaved: string[];
  usersCarted: string[];
  usersReviewed: string[];
  usersLiked: string[];
  gender: string[];
  category: Category;
  defaultPicture: IPicture;
  pictures: IPicture[];
  name: string;
  shortDescription: string;
  fullDescription: string;
  metaKeywords: string;
  metaDescription: string;
  metaTitle: string;
  seName: string;
  sku: string;
  vendor: Vendor;
  price: IPrice;
  productTags: string[];
  productAttributes: IProductAttribute[];
  hasAttributes: boolean;
  productReviewOverview: {
    ratingSum: number;
    totalReviews: number;
  };
  likes: number;
  carts: number;
  saves: number;
  productReviews: Review[];
  inStock: boolean;
  deleted: boolean;
  stock: number;
}

export interface ProductActions {
  isLiked: boolean;
  isSaved: boolean;
  isReviewed: boolean;
  isInCart: boolean;
}

export type ProductListItem = Omit<
  IFullProduct,
  'productReviews' | 'fullDescription' | 'productAttributes'
> &
  ProductActions;
