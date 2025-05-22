export const userInteractionPaths = {
  '/user/likeProduct/{id}': {
    post: {
      tags: ['User Interactions'],
      summary: 'Like a product',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Product ID to like',
        },
      ],
      responses: {
        200: {
          description: 'Product liked successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/schemas/ErrorResponse' },
      },
    },
  },

  '/user/unlikeProduct/{id}': {
    post: {
      tags: ['User Interactions'],
      summary: 'Unlike a previously liked product',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Product ID to unlike',
        },
      ],
      responses: {
        200: {
          description: 'Product unliked successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/schemas/ErrorResponse' },
      },
    },
  },

  '/user/saveProduct/{id}': {
    post: {
      tags: ['User Interactions'],
      summary: 'Save product',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Product ID to save',
        },
      ],
      responses: {
        200: {
          description: 'Product saved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/schemas/ErrorResponse' },
      },
    },
  },

  '/user/unsaveProduct/{id}': {
    post: {
      tags: ['User Interactions'],
      summary: 'Remove product from saved items',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Product ID to unsave',
        },
      ],
      responses: {
        200: {
          description: 'Product unSaved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/schemas/ErrorResponse' },
      },
    },
  },

  '/user/followVendor/{id}': {
    post: {
      tags: ['User Interactions'],
      summary: 'Follow a vendor',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Vendor ID to follow',
        },
      ],
      responses: {
        200: {
          description: 'vendor followed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  success: { type: 'boolean' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/schemas/ErrorResponse' },
      },
    },
  },

  '/user/unfollowVendor/{id}': {
    post: {
      tags: ['User Interactions'],
      summary: 'Unfollow a vendor',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Vendor ID to unfollow',
        },
      ],
      responses: {
        200: {
          description: 'vendor unfollowed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  success: { type: 'string' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/schemas/ErrorResponse' },
      },
    },
  },

  '/user/addReview/{id}': {
    post: {
      tags: ['User Interactions'],
      summary: 'Add product review',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Product ID to review',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['reviewText', 'rating'],
              properties: {
                reviewText: {
                  type: 'string',
                  description: 'Review content',
                },
                rating: {
                  type: 'number',
                  minimum: 1,
                  maximum: 5,
                  description: 'Rating from 1 to 5',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Review added successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
      },
    },
  },
};
