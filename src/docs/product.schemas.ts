export const productSchemaParts = {
  Attributes: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        attributeControlType: {
          type: 'string',
          enum: ['DropdownList', 'RadioList', 'Checkboxes', 'Color'],
        },
        values: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              priceAdjustmentValue: { type: 'number' },
              colorRgb: { type: 'string' },
            },
          },
        },
      },
    },
  },

  Vendor: {
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

  Review: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      product: { type: 'string' },
      reviewText: { type: 'string' },
      rating: { type: 'number' },
      customer: {
        type: 'object',
        properties: {
          imageUrl: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
        },
      },
    },
  },

  Tag: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      seName: { type: 'string' },
      productCount: { type: 'number' },
    },
  },

  Category: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      seName: { type: 'string' },
      productsCount: { type: 'number' },
    },
  },
};

export const allFieldsProductSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    shortDescription: { type: 'string' },
    seName: { type: 'string' },
    sku: { type: 'string' },
    hasAttributes: { type: 'boolean' },
    inStock: { type: 'boolean' },
    likes: { type: 'number' },
    carts: { type: 'number' },
    saves: { type: 'number' },
    productReviews: { type: 'array', items: productSchemaParts.Review },
    productTags: { type: 'array', items: productSchemaParts.Tag },
    vendor: productSchemaParts.Vendor,
    productAttributes: productSchemaParts.Attributes,
    category: productSchemaParts.Category,
    updatedAt: { type: 'string', format: 'date-time' },
    productReviewOverview: {
      type: 'object',
      properties: {
        ratingSum: { type: 'number' },
        totalReviews: { type: 'number' },
      },
    },
    pictures: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          imageUrl: { type: 'string' },
        },
      },
    },
    price: {
      type: 'object',
      properties: {
        old: { type: 'number' },
        price: { type: 'number' },
      },
    },
    fullDescription: { type: 'string' },
    isLiked: { type: 'boolean' },
    isSaved: { type: 'boolean' },
    isInCart: { type: 'boolean' },
    isReviewed: { type: 'boolean' },
  },
};

export const simpleProductSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    shortDescription: { type: 'string' },
    seName: { type: 'string' },
    sku: { type: 'string' },
    hasAttributes: { type: 'boolean' },
    inStock: { type: 'boolean' },
    likes: { type: 'number' },
    carts: { type: 'number' },
    saves: { type: 'number' },
    productTags: { type: 'array', items: productSchemaParts.Tag },
    vendor: productSchemaParts.Vendor,
    category: productSchemaParts.Category,
    updatedAt: { type: 'string', format: 'date-time' },
    productReviewOverview: {
      type: 'object',
      properties: {
        ratingSum: { type: 'number' },
        totalReviews: { type: 'number' },
      },
    },
    pictures: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          imageUrl: { type: 'string' },
        },
      },
    },
    price: {
      type: 'object',
      properties: {
        old: { type: 'number' },
        price: { type: 'number' },
      },
    },
    isLiked: { type: 'boolean' },
    isSaved: { type: 'boolean' },
    isInCart: { type: 'boolean' },
    isReviewed: { type: 'boolean' },
  },
};

export const productSchemas = {
  ProductAttributesResponse: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      seName: { type: 'string' },
      hasAttributes: true,
      ProductAttributes: productSchemaParts.Attributes,
    },
  },
  ProductReviews: { type: 'array', items: productSchemaParts.Review },
  UserActions: {
    type: 'object',
    properties: {
      isLiked: { type: 'boolean' },
      isSaved: { type: 'boolean' },
      isInCart: { type: 'boolean' },
      isReviewed: { type: 'boolean' },
    },
  },
};
