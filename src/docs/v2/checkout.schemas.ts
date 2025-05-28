export const checkoutSchemas = {
  CheckoutResponse: {
    type: 'object',
    properties: {
      cartItems: {
        type: 'array',
        items: { $ref: '#/components/schemas/CartProductResponse' },
      },
      addresses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' },
          },
        },
      },
      total: { type: 'number' },
      currency: { type: 'string' },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
};
