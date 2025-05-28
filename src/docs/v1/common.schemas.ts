import { productSchemaParts, simpleProductSchema } from './product.schemas';

export const commonSchemas = {
  ErrorResponse: {
    type: 'object',
    required: ['status', 'message'],
    properties: {
      status: {
        type: 'string',
        enum: ['fail', 'error'],
        description: '"fail" for client errors (4xx), "error" for server errors (5xx)',
      },
      message: {
        type: 'string',
        description: 'Error message describing what went wrong',
      },
    },
  },

  Pagination: {
    type: 'object',
    properties: {
      hasNext: { type: 'boolean' },
      current: { type: 'number' },
      limit: { type: 'number' },
    },
  },

  CartProductResponse: {
    type: 'object',
    properties: {
      product: simpleProductSchema,
      quantity: { type: 'integer' },
      attributes: productSchemaParts.Attributes,
    },
  },
};

export const commonResponse = {
  BadRequest: {
    description: 'Bad Request - Invalid input data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },
  Unauthorized: {
    description: 'Unauthorized - Invalid Credentials',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },
  NotFound: {
    description: 'Not Found - Resource not found',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },
  ServerError: {
    description: 'Server Error - Internal server error',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          status: 'error',
          message: 'Somthing Went Wrong',
        },
      },
    },
  },
  Forbidden: {
    description: 'Forbidden - User does not have access rights',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },
  Conflict: {
    description: 'Conflict - Resource already exists or state conflict',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },
};
