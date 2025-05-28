import { SwaggerOptions } from 'swagger-ui-express';
import { DOMAIN } from '@/config/env.config';

export const baseSwaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'MyShop API Documentation',
    description: 'API documentation for MyShop e-commerce platform',
  },
  components: {
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
  servers: [{ url: `${DOMAIN}/api` }],
} satisfies SwaggerOptions['definition'];
