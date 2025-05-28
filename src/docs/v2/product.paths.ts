export const productPaths = {
  '/product/{seName}': {
    get: {
      tags: ['Product'],
      summary: 'Get single product by SEO name',
      description: 'Retrieves detailed product information using the product SEO friendly name',
      parameters: [
        {
          name: 'seName',
          in: 'path',
          required: true,
          description: 'SEO friendly name of the product',
          schema: { type: 'string' },
          example: 'Build_your_own_computer',
        },
      ],
      responses: {
        200: {
          description: 'Product found successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductDetailsResponse',
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/ServerError' },
      },
    },
  },

  '/product/attributes/{seName}': {
    get: {
      tags: ['Product'],
      summary: 'Get a product attributes',
      parameters: [
        {
          name: 'seName',
          in: 'path',
          required: true,
          description: 'SEO friendly name of the product',
          schema: { type: 'string' },
          example: 'Build_your_own_computer',
        },
      ],
      responses: {
        200: {
          description: 'Product attributes retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductAttributesResponse' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },

  '/product/reviews/{id}': {
    get: {
      tags: ['Product'],
      summary: 'Get a product reviews',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Product ID',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'page',
          in: 'query',
          description: 'Page number',
          required: false,
          schema: {
            type: 'integer',
            default: 1,
            minimum: 1,
          },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Items per page',
          required: false,
          schema: {
            type: 'integer',
            default: 10,
            minimum: 1,
          },
        },
      ],
      responses: {
        200: {
          description: 'Product reviews retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ProductReviews' },
                  },
                  pages: { $ref: '#/components/schemas/PaginationResponse' },
                },
              },
            },
          },
        },
        404: {
          $ref: '#/components/responses/NotFound',
        },
      },
    },
  },

  '/product/details/{seName}': {
    get: {
      tags: ['Product'],
      summary: 'Get detailed product information',
      parameters: [
        {
          name: 'seName',
          in: 'path',
          required: true,
          description: 'SEO friendly name of the product',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'Product details retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductDetailsResponse' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },

  '/product/actions/{seName}': {
    get: {
      tags: ['Product'],
      summary: 'Get product user actions status',
      parameters: [
        {
          name: 'seName',
          in: 'path',
          required: true,
          description: 'SEO friendly name of the product',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Product actions status retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserActions' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },
};
