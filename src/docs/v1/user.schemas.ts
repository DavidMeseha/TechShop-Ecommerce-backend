import { productSchemaParts, simpleProductSchema } from './product.schemas';

export const userSchemas = {
  UserProductsResponse: {
    type: 'array',
    items: simpleProductSchema,
  },

  UserProfileInfoResponse: {
    type: 'object',
    properties: {
      dateOfBirthDay: { type: 'number' },
      dateOfBirthMonth: { type: 'number' },
      dateOfBirthYear: { type: 'number' },
      email: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      gender: { type: 'string', enum: ['male', 'female', null] },
      imageUrl: { type: 'string' },
      phone: { type: 'string' },
      ordersCount: { type: 'number' },
    },
  },

  Address: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      address: { type: 'string' },
      city: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          code: { type: 'string' },
        },
      },
      country: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          code: { type: 'string' },
        },
      },
    },
  },

  SimpleOrder: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            product: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                seName: { type: 'string' },
              },
            },
            quantity: { type: 'number' },
          },
        },
      },
      billingStatus: {
        type: 'string',
        enum: ['pending', 'paid', 'failed'],
      },
      billingMethod: {
        type: 'string',
        enum: ['card', 'cash'],
      },
      shippingStatus: {
        type: 'string',
        enum: ['pending', 'processing', 'shipped', 'delivered'],
      },
      shippingAddress: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          address: { type: 'string' },
          city: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              code: { type: 'string' },
            },
          },
          country: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              code: { type: 'string' },
            },
          },
        },
      },
      subTotal: { type: 'number' },
      totalValue: { type: 'number' },
      shippingFees: { type: 'number' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },

  OrderDetails: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            product: {
              type: 'object',
              properties: {
                seName: { type: 'string' },
                name: { type: 'string' },
                inStock: { type: 'boolean' },
                vendor: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    seName: { type: 'string' },
                    imageUrl: { type: 'string' },
                    productCount: { type: 'number' },
                  },
                },
                category: productSchemaParts.Category,
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
              },
            },
            quantity: { type: 'number' },
            attributes: productSchemaParts.Attributes,
          },
        },
      },
      billingStatus: {
        type: 'string',
        enum: ['pending', 'paid', 'failed'],
      },
      billingMethod: {
        type: 'string',
        enum: ['card', 'cash'],
      },
      shippingAddress: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          address: { type: 'string' },
          city: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              code: { type: 'string' },
            },
          },
          country: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              code: { type: 'string' },
            },
          },
        },
      },
      shippingStatus: {
        type: 'string',
        enum: ['pending', 'processing', 'shipped', 'delivered'],
      },
      subTotal: { type: 'number' },
      totalValue: { type: 'number' },
      shippingFees: { type: 'number' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },

  UserProfileInfo: {
    type: 'object',
    properties: {
      dateOfBirthDay: { type: 'number' },
      dateOfBirthMonth: { type: 'number' },
      dateOfBirthYear: { type: 'number' },
      email: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      gender: { type: 'string', enum: ['male', 'female', null] },
      imageUrl: { type: 'string' },
      phone: { type: 'string' },
    },
  },
};
