export const userInteractionPaths = {
  '/user/actions/actions/likeProduct/{id}': {
    post: {
      tags: ['Interactions'],
      summary: 'Like a product',
      security: [{ bearerAuth: [] }],
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

  '/user/actions/unlikeProduct/{id}': {
    post: {
      tags: ['Interactions'],
      summary: 'Unlike a previously liked product',
      security: [{ bearerAuth: [] }],
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

  '/user/actions/saveProduct/{id}': {
    post: {
      tags: ['Interactions'],
      summary: 'Save product',
      security: [{ bearerAuth: [] }],
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

  '/user/actions/unsaveProduct/{id}': {
    post: {
      tags: ['Interactions'],
      summary: 'Remove product from saved items',
      security: [{ bearerAuth: [] }],
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

  '/user/actions/followVendor/{id}': {
    post: {
      tags: ['Interactions'],
      summary: 'Follow a vendor',
      security: [{ bearerAuth: [] }],
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

  '/user/actions/unfollowVendor/{id}': {
    post: {
      tags: ['Interactions'],
      summary: 'Unfollow a vendor',
      security: [{ bearerAuth: [] }],
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

  '/user/actions/addReview/{id}': {
    post: {
      tags: ['Interactions'],
      summary: 'Add product review',
      security: [{ bearerAuth: [] }],
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

  '/user/cart/add/{id}': {
    post: {
      tags: ['Interactions'],
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

  '/user/cart/remove/{id}': {
    delete: {
      tags: ['Interactions'],
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
};
