import mongoose, { CallbackError } from 'mongoose';

import { AttributeSchema, ImageSchema } from './supDocumentsSchema';
import { IFullProduct } from '@/types/product.interface';

export interface IFullProductDocument extends Omit<IFullProduct, '_id'>, mongoose.Document {}

const DEFAULT_PRODUCT_IMAGE = {
  imageUrl: '',
  title: '',
  alternateText: '',
} as const;

// Schema field groups
const basicFields = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  seName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
};

const mediaFields = {
  pictures: [
    {
      type: ImageSchema,
      default: DEFAULT_PRODUCT_IMAGE,
    },
  ],
};

const pricingFields = {
  price: {
    oldPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
};

const metaFields = {
  fullDescription: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  metaKeywords: { type: String, trim: true },
  metaTitle: { type: String, trim: true },
};

const attributeFields = {
  hasAttributes: {
    type: Boolean,
    required: true,
    default: false,
  },
  productAttributes: [AttributeSchema],
};

const statusFields = {
  inStock: {
    type: Boolean,
    default: true,
    index: true,
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
};

const statsFields = {
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  carts: {
    type: Number,
    default: 0,
    min: 0,
  },
  saves: {
    type: Number,
    default: 0,
    min: 0,
  },
  usersLiked: [
    {
      type: String,
    },
  ],
  usersSaved: [
    {
      type: String,
    },
  ],
  usersCarted: [
    {
      type: String,
    },
  ],
  usersReviewed: [
    {
      type: String,
    },
  ],
  productReviewOverview: {
    ratingSum: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
};

const relationFields = {
  gender: [{ type: String, enum: ['male', 'female', 'unisex'] }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories',
    required: true,
    index: true,
  },
  productReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reviews',
    },
  ],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendors',
    required: true,
    index: true,
  },
  productTags: [
    {
      type: String,
      ref: 'Tags',
    },
  ],
};

const productFields = {
  ...basicFields,
  ...mediaFields,
  ...pricingFields,
  ...metaFields,
  ...attributeFields,
  ...statusFields,
  ...statsFields,
  ...relationFields,
};

export const ProductSchema = new mongoose.Schema<IFullProductDocument>(productFields, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

function softDeletePlugin(schema: mongoose.Schema) {
  function addNotDeleted(this: mongoose.Query<any, any>, next: (err?: CallbackError) => void) {
    if (!Object.prototype.hasOwnProperty.call(this.getFilter(), 'deleted')) {
      this.where({ deleted: { $ne: true } });
    }
    next();
  }

  schema.pre('find', addNotDeleted);
  schema.pre('findOne', addNotDeleted);
  schema.pre('findOneAndUpdate', addNotDeleted);
  schema.pre('countDocuments', addNotDeleted);
  schema.pre(
    'aggregate',
    function (this: mongoose.Aggregate<any[]>, next: (err?: CallbackError) => void) {
      this.pipeline().unshift({ $match: { deleted: { $ne: true } } });
      next();
    }
  );
}

ProductSchema.plugin(softDeletePlugin);

ProductSchema.index({ name: 'text' });
ProductSchema.index({ seName: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ 'price.price': 1 });

const Products =
  (mongoose.models.Products as mongoose.Model<IFullProductDocument>) ||
  mongoose.model<IFullProductDocument>('Products', ProductSchema);

export default Products;
