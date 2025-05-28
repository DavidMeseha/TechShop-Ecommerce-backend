export const guestPaths = {
  '/user/cart/products': {
    get: {
      tags: ['User'],
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

  '/user/cart/ids': {
    get: {
      tags: ['User'],
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

  '/user/changeLanguage/{lang}': {
    post: {
      tags: ['User'],
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
