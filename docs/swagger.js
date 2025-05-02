const swaggerAutoGen = require('swagger-autogen');

const _options = {
  openapi: 'OpenAPI 3',
  language: 'en-US',
  disableLogs: false,
  autoHeaders: false,
  autoQuery: true,
  autoBody: true,
};

const generateSwagger = swaggerAutoGen(_options);

const swaggerDocument = {
  info: {
    version: '1.0.0',
    title: 'TechShop Apis',
    description: 'API for Managing TechShop calls',
    contact: {
      name: 'API Support',
      email: 'davidmmyh@gmail.com',
    },
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'TechShop E-Commerce',
      description: 'TechShop E-Commerce APIs',
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter your bearer token in the format "Bearer {token}"',
    },
  },
  components: {
    parameters: {
      Headers: {
        in: 'header',
        schema: {
          type: 'object',
          properties: {
            Authorization: {
              type: 'string',
              description: 'Bearer token for authentication',
              example: 'Bearer <token>',
            },
            // Add any other headers you want to show, excluding origin and accept-language
          },
        },
      },
    },
  },
  definitions: {
    todoResponse: {
      code: 200,
      message: 'Success',
    },
    'errorResponse.400': {
      code: 400,
      message: 'The request was malformed or invalid. Please check the request parameters.',
    },
    'errorResponse.401': {
      code: 401,
      message: 'Authentication failed or user lacks proper authorization.',
    },
    'errorResponse.403': {
      code: 403,
      message: 'You do not have permission to access this resource.',
    },
    'errorResponse.404': {
      code: 404,
      message: 'The requested resource could not be found on the server.',
    },
    'errorResponse.500': {
      code: 500,
      message: 'An unexpected error occurred on the server. Please try again later.',
    },
  },
};
const swaggerFile = './docs/swagger.json';
const apiRouteFile = ['./src/app.ts'];
const config = {
  swagger: swaggerDocument,
  hideHeaders: ['origin', 'accept-language'], // Specify headers to hide
};
generateSwagger(swaggerFile, apiRouteFile, config);
