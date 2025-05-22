import { allFieldsProductSchema, simpleProductSchema } from './product.schemas';

export const catalogSchemas = {
  ProductDetailsResponse: allFieldsProductSchema,
  SimpleProductResponse: simpleProductSchema,
  VendorResponse: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      seName: { type: 'string' },
      imageUrl: { type: 'string' },
      productCount: { type: 'number' },
      followersCount: { type: 'number' },
      isFollowed: { type: 'boolean' },
    },
  },
  TagResponse: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      seName: { type: 'string' },
      productCount: { type: 'number' },
    },
  },

  CategoryResponse: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      seName: { type: 'string' },
      productCount: { type: 'number' },
    },
  },
};
