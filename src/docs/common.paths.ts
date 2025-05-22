export const commonPaths = {
  '/common/cart': {
    get: {
      tags: ['Cart'],
      summary: 'Get user/guest cart products',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Cart products retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/SimpleProductResponse' },
              },
            },
          },
        },
      },
      403: { $ref: '#/components/responses/Forbidden' },
    },
  },

  '/common/cart/ids': {
    get: {
      tags: ['Cart'],
      summary: 'Get IDs of products in user/guest cart',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Cart product IDs retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
        403: { $ref: '#/components/responses/Forbidden' },
      },
    },
  },

  '/common/cart/add/{id}': {
    post: {
      tags: ['Cart'],
      summary: 'Add product to user/guest cart',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Product ID to add to cart',
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['quantity'],
              properties: {
                quantity: {
                  type: 'integer',
                  minimum: 1,
                  description: 'Number of items to add to cart',
                },
                attributes: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['name', 'value', '_id'],
                    properties: {
                      _id: { type: 'string' },
                      values: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            _id: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            example: {
              quantity: 1,
              attributes: [{ _id: 'xxxxxxxxxxx', values: [{ _id: 'xxxxxxxxxx' }] }],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Product added to cart successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  status: { type: 'success' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/responses/Conflict' },
      },
    },
  },

  '/common/cart/remove/{id}': {
    delete: {
      tags: ['Cart'],
      summary: 'Remove product from cart',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Product ID to remove from cart',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'Product removed from cart successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  status: { type: 'success' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/responses/Conflict' },
      },
    },
  },

  '/common/checkout': {
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

  '/common/changeLanguage/{lang}': {
    post: {
      tags: ['Settings'],
      summary: 'Change user language preference',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'lang',
          in: 'path',
          required: true,
          description: 'Language code',
          schema: {
            type: 'string',
            enum: ['en', 'ar', 'fr'],
          },
        },
      ],
      responses: {
        200: {
          description: 'Language changed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  status: { type: 'success' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        403: { $ref: '#/components/responses/Forbidden' },
      },
    },
  },
};
