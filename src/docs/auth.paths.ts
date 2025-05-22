export const authPaths = {
  '/auth/check': {
    get: {
      tags: ['Auth'],
      summary: 'Check JWT token validity',
      responses: {
        200: {
          description: 'Token is valid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserDataResponse' },
            },
          },
        },
        403: { $ref: '#/components/responses/Forbidden' },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/auth/guest': {
    get: {
      tags: ['Auth'],
      summary: 'Get guest access token',
      responses: {
        200: {
          description: 'Guest token generated',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TokenResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'User login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponse',
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterRequest',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  succss: { type: 'boolean', example: 'true' },
                  message: { type: 'string', example: 'user registered successfully' },
                },
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/BadRequest',
        },
        409: {
          $ref: '#/components/responses/Conflict',
        },
      },
    },
  },

  '/auth/refreshToken': {
    get: {
      tags: ['Auth'],
      summary: 'Refresh access token',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'New token generated',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TokenResponse',
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

  '/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'User logout',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Successfully logged out',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LogoutResponse',
              },
            },
          },
          example: {
            status: 'success',
          },
        },
        401: {
          $ref: '#/components/responses/Unauthorized',
        },
      },
    },
  },
};
