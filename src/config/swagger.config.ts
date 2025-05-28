import swaggerJsdoc from 'swagger-jsdoc';
import { v2SwaggerConfig } from '../docs/v2';

export const swaggerSpecs = swaggerJsdoc({
  definition: v2SwaggerConfig,
  apis: ['../../src/routes/api/v2/*.ts', '../../src/controllers/**/*.ts'],
});
