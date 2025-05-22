import { Types } from 'mongoose';
import { IUser } from './user.interface';

export interface ICategory {
  name: string;
  seName: string;
  productsCount?: number;
}

export interface IPicture {
  imageUrl: string;
  title: string;
  alternateText: string;
}

export interface IPrice {
  oldPrice?: number;
  price: number;
}

export interface IProductAttribute {
  name: string;
  attributeControlType: string;
  values: (IProductAttributeValue & { _id: string })[];
}

export interface IProductAttributeValue {
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
  product?: IFullProduct;
  customer?: IUser;
  reviewText: string;
  rating: number;
}

export interface IVendor {
  name: string;
  seName: string;
  imageUrl?: string;
  productCount?: number;
  followersCount?: number;
  user: IUser;
}

export interface ITag {
  name: string;
  seName: string;
  productCount?: number;
}

export interface IFullProduct {
  usersSaved: string[];
  usersCarted: string[];
  usersReviewed: string[];
  usersLiked: string[];
  gender: string[];
  category: ICategory;
  defaultPicture?: IPicture;
  pictures?: IPicture[];
  name: string;
  shortDescription: string;
  fullDescription?: string;
  metaKeywords?: string;
  metaDescription?: string;
  metaTitle?: string;
  seName: string;
  sku: string;
  vendor?: Types.ObjectId;
  price: IPrice;
  productTags?: ITag[];
  productAttributes?: IProductAttribute[];
  hasAttributes: boolean;
  productReviewOverview?: {
    ratingSum: number;
    totalReviews: number;
  };
  likes?: number;
  carts?: number;
  saves?: number;
  productReviews?: IProductReview[];
  inStock?: boolean;
}
