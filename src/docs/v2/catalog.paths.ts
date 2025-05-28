export const catalogPaths = {
  '/catalog/homefeed': {
    get: {
      tags: ['Catalog'],
      summary: 'Get home page feed',
      description: 'Retrieves feed of products for various perpouses',
      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          description: 'Page number for pagination',
          schema: {
            type: 'integer',
            default: 1,
            minimum: 1,
          },
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          description: 'Number of items per page',
          schema: {
            type: 'integer',
            default: 10,
            minimum: 1,
            maximum: 50,
          },
        },
      ],
      responses: {
        200: {
          description: 'Home feed retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/SimpleProductResponse',
                    },
                  },
                  pages: {
                    $ref: '#/components/schemas/Pagination',
                  },
                },
              },
            },
          },
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/discover/vendors': {
    get: {
      tags: ['Catalog'],
      summary: 'Get vendors list for discover page',
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
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
          description: 'Number of vendors per page',
          required: false,
          schema: {
            type: 'integer',
            default: 5,
            minimum: 2,
          },
        },
      ],
      responses: {
        200: {
          description: 'List of vendors retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/VendorResponse',
                    },
                  },
                  pages: {
                    $ref: '#/components/schemas/Pagination',
                  },
                },
              },
            },
          },
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/discover/tags': {
    get: {
      tags: ['Catalog'],
      summary: 'Get product tags for discover page',
      parameters: [
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
            default: 5,
            minimum: 2,
          },
        },
      ],
      responses: {
        200: {
          description: 'List of tags retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/TagResponse',
                    },
                  },
                  pages: {
                    $ref: '#/components/schemas/Pagination',
                  },
                },
              },
            },
          },
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/discover/categories': {
    get: {
      tags: ['Catalog'],
      summary: 'Get categories for discover page',
      parameters: [
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
            minimum: 2,
          },
        },
      ],
      responses: {
        200: {
          description: 'List of categories retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/CategoryResponse',
                    },
                  },
                  pages: {
                    $ref: '#/components/schemas/Pagination',
                  },
                },
              },
            },
          },
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/vendor/{seName}': {
    get: {
      tags: ['Catalog'],
      summary: 'Get vendor information by SEO name',
      parameters: [
        {
          name: 'seName',
          in: 'path',
          required: true,
          description: 'SEO friendly name of the vendor',
          schema: { type: 'string' },
          example: 'tech_shop',
        },
      ],
      responses: {
        200: {
          description: 'Vendor information retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/VendorResponse',
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/BadRequest',
        },
        404: {
          $ref: '#/components/responses/NotFound',
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/vendor/products/{id}': {
    get: {
      tags: ['Catalog'],
      summary: 'Get products by vendor ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Vendor ID',
          schema: { type: 'string' },
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
            default: 5,
            minimum: 2,
          },
        },
      ],
      responses: {
        200: {
          description: 'Vendor products retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/SimpleProductResponse',
                    },
                  },
                  pages: {
                    $ref: '#/components/schemas/Pagination',
                  },
                },
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/BadRequest',
        },
        404: {
          $ref: '#/components/responses/NotFound',
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/tag/{seName}': {
    get: {
      tags: ['Catalog'],
      summary: 'Get tag information by SEO name',
      parameters: [
        {
          name: 'seName',
          in: 'path',
          required: true,
          description: 'SEO friendly name of the tag',
          schema: { type: 'string' },
          example: 'electronics',
        },
      ],
      responses: {
        200: {
          description: 'Tag information retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TagResponse',
              },
            },
          },
        },
        404: {
          $ref: '#/components/responses/NotFound',
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/tag/products/{id}': {
    get: {
      tags: ['Catalog'],
      summary: 'Get products by tag ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Tag ID',
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
            maximum: 50,
          },
        },
      ],
      responses: {
        200: {
          description: 'Tagged products retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/SimpleProductResponse',
                    },
                  },
                  pages: {
                    $ref: '#/components/schemas/Pagination',
                  },
                },
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/BadRequest',
        },
        404: {
          $ref: '#/components/responses/NotFound',
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/category/{seName}': {
    get: {
      tags: ['Catalog'],
      summary: 'Get category information by SEO name',
      parameters: [
        {
          name: 'seName',
          in: 'path',
          required: true,
          description: 'SEO friendly name of the category',
          schema: { type: 'string' },
          example: 'computers',
        },
      ],
      responses: {
        200: {
          description: 'category information retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/categoryResponse',
              },
            },
          },
        },
        404: {
          $ref: '#/components/responses/NotFound',
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/category/products/{id}': {
    get: {
      tags: ['Catalog'],
      summary: 'Get products by Category ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Tag ID',
          schema: { type: 'string' },
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
          description: 'products under category retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/SimpleProductResponse',
                    },
                  },
                  pages: {
                    $ref: '#/components/schemas/Pagination',
                  },
                },
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/BadRequest',
        },
        404: {
          $ref: '#/components/responses/NotFound',
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/Vendor/all': {
    get: {
      tags: ['Catalog'],
      summary: 'Get featured vendors (this is created only for static generation)',
      responses: {
        200: {
          description: 'vendors retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/VendorResponse',
                },
              },
            },
          },
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/category/all': {
    get: {
      tags: ['Catalog'],
      summary: 'Get featured categories (this is created only for static generation)',
      responses: {
        200: {
          description: 'categories retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/CategoryResponse',
                },
              },
            },
          },
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/tag/all': {
    get: {
      tags: ['Catalog'],
      summary: 'Get featured tags (this is created only for static generation)',
      responses: {
        200: {
          description: 'tags retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/CategoryResponse',
                },
              },
            },
          },
        },
        500: {
          $ref: '#/components/responses/ServerError',
        },
      },
    },
  },

  '/catalog/find': {
    post: {
      tags: ['Catalog'],
      summary: 'Search across all entities',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                searchText: { type: 'string' },
                categories: { type: 'boolean' },
                vendors: { type: 'boolean' },
                tags: { type: 'boolean' },
                products: { type: 'boolean' },
              },
              required: ['searchText'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Search results retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    item: {
                      type: 'object',
                      properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        seName: { type: 'string' },
                        imageUrl: { type: 'string', nullable: true },
                      },
                    },
                    type: {
                      type: 'string',
                      enum: ['product', 'vendor', 'category', 'tag'],
                    },
                  },
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
