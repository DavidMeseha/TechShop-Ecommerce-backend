import swaggerJsdoc from 'swagger-jsdoc';
import { DOMAIN } from './env.config';
import { authSchemas } from '../docs/auth.schemas';
import { authPaths } from '../docs/auth.paths';
import { commonResponse, commonSchemas } from '../docs/common.schemas';
import { SwaggerOptions } from 'swagger-ui-express';
import { catalogSchemas } from '../docs/catalog.schemas';
import { catalogPaths } from '../docs/catalog.paths';
import { productPaths } from '../docs/product.paths';
import { productSchemas } from '../docs/product.schemas';
import { commonPaths } from '../docs/common.paths';
import { userPaths } from '../docs/user.paths';
import { userSchemas } from '../docs/user.schemas';
import { userInteractionPaths } from '../docs/userInteractions.paths';

const options: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyShop API Documentation',
      version: '1.0.0',
      description: 'API documentation for MyShop e-commerce platform',
    },
    servers: [{ url: `${DOMAIN}/api` }],
    paths: {
      ...authPaths,
      ...userPaths,
      ...userInteractionPaths,
      ...catalogPaths,
      ...productPaths,
      ...commonPaths,
    },
    components: {
      schemas: {
        ...authSchemas,
        ...userSchemas,
        ...commonSchemas,
        ...productSchemas,
        ...catalogSchemas,
      },
      responses: {
        ...commonResponse,
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          name: 'Authorization',
          description: 'JWT token to identify user/guest',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/**/*.ts'],
};

export const specs = swaggerJsdoc(options);
