export const checkoutPaths = {
  '/checkout/details': {
    get: {
      tags: ['Checkout'],
      summary: 'Get checkout details',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Checkout details retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CheckoutResponse' },
            },
          },
        },
        403: { $ref: '#/components/responses/Forbidden' },
      },
    },
  },

  '/checkout/preperPayment': {
    get: {
      tags: ['Checkout'],
      summary: 'Prepare payment intent for checkout',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Payment intent created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  paymentSecret: {
                    type: 'string',
                    description: 'Stripe payment intent client secret',
                  },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        422: { $ref: '#/components/responses/UnprocessableEntity' },
      },
    },
  },

  '/checkout/submit': {
    post: {
      tags: ['Checkout'],
      summary: 'Submit new order',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['billingMethod', 'shippingAddressId'],
              properties: {
                billingMethod: {
                  type: 'string',
                  enum: ['card', 'cod'],
                  description: 'Payment method',
                },
                shippingAddressId: {
                  type: 'string',
                  description: 'ID of the selected shipping address',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Order created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { _id: { type: 'string' }, success: { type: 'boolean' } },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        422: { $ref: '#/components/responses/UnprocessableEntity' },
      },
    },
  },
};
