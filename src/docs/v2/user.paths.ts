export const userPaths = {
  '/user/likedProducts': {
    get: {
      tags: ['User'],
      summary: 'Get products liked by user',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of liked products',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/UserProductsResponse',
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/user/savedProducts': {
    get: {
      tags: ['User'],
      summary: 'Get products saved by user',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of saved products',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/UserProductsResponse',
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/user/followingVendors': {
    get: {
      tags: ['User'],
      summary: 'Get vendors followed by user',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of followed vendors',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
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
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/user/reviews': {
    get: {
      tags: ['User'],
      summary: 'Get reviews written by user',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 },
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 10 },
        },
      ],
      responses: {
        200: {
          description: 'List of user reviews',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: { type: 'string' },
                        product: {
                          type: 'object',
                          properties: {
                            _id: { type: 'string' },
                            name: { type: 'string' },
                            seName: { type: 'string' },
                          },
                        },
                        reviewText: { type: 'string' },
                        rating: { type: 'number' },
                        createdAt: { type: 'string' },
                      },
                    },
                  },
                  pages: { $ref: '#/components/schemas/Pagination' },
                },
              },
            },
          },
        },
        401: {
          $ref: '#/components/responses/Unauthorized',
        },
      },
    },
  },

  '/user/info': {
    get: {
      tags: ['User'],
      summary: 'Get user profile information',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'User profile data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserProfileInfoResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
    put: {
      tags: ['User'],
      summary: 'Update user profile information',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                gender: {
                  type: 'string',
                  enum: ['male', 'female', null],
                },
                imageUrl: { type: 'string' },
                phone: { type: 'string' },
                dateOfBirthDay: { type: 'number' },
                dateOfBirthMonth: { type: 'number' },
                dateOfBirthYear: { type: 'number' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Profile updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserProfileInfo',
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/user/addresses': {
    get: {
      tags: ['User'],
      summary: 'Get user shipping addresses',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of user addresses',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Address' },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/user/addresses/add': {
    post: {
      tags: ['User'],
      summary: 'Add new shipping address',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['address', 'city', 'country'],
              properties: {
                address: { type: 'string' },
                city: { type: 'string' },
                country: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Address added successfully',
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
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/user/addresses/edit/{id}': {
    put: {
      tags: ['User'],
      summary: 'Edit shipping address',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Address ID to edit',
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['address', 'city', 'country'],
              properties: {
                address: {
                  type: 'string',
                  description: 'Street address',
                },
                city: {
                  type: 'string',
                  description: 'City ID',
                },
                country: {
                  type: 'string',
                  description: 'Country ID',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Address updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AddressResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid input',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                status: 'fail',
                message: 'should recive address, country and city',
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

  '/user/address/delete/{id}': {
    delete: {
      tags: ['User'],
      summary: 'Delete user shipping address',
      security: [{ bearerAuth: [] }],
      description: "Remove a shipping address from user's saved addresses",
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Address ID to delete',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'Address deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                  success: {
                    type: 'boolean',
                  },
                },
              },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
      },
    },
  },

  '/user/orders': {
    get: {
      tags: ['User'],
      summary: 'Get user orders history',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1,
            minimum: 1,
          },
          description: 'Page number',
        },
        {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            default: 10,
            minimum: 1,
          },
          description: 'Items per page',
        },
      ],
      responses: {
        200: {
          description: 'List of user orders',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/SimpleOrder' },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/user/order/{id}': {
    get: {
      tags: ['User'],
      summary: 'Get order details by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Order ID',
        },
      ],
      responses: {
        200: {
          description: 'Order details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderDetails' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },

  '/user/changePassword': {
    post: {
      tags: ['User'],
      summary: 'Change user password',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['password', 'newPassword'],
              properties: {
                password: {
                  type: 'string',
                  format: 'password',
                  description: 'Current password',
                },
                newPassword: {
                  type: 'string',
                  format: 'password',
                  description: 'New password',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password changed successfully',
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
        409: { $ref: '#/components/schemas/ErrorResponse' },
      },
    },
  },

  '/user/upload': {
    post: {
      tags: ['Upload'],
      summary: 'Upload an image file',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                image: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Image uploaded successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  imageUrl: {
                    type: 'string',
                    format: 'uri',
                  },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        403: { $ref: '#/components/responses/Forbidden' },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
};
