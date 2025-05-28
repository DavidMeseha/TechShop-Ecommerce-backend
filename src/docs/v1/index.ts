// Import other v1 schemas and paths...

import { baseSwaggerConfig } from '../swaggerBaseConfig';
import { authPaths } from './auth.paths';
import { authSchemas } from './auth.schemas';
import { catalogPaths } from './catalog.paths';
import { catalogSchemas } from './catalog.schemas';
import { commonResponse, commonSchemas } from './common.schemas';
import { commonPaths } from './common.paths';
import { productPaths } from './product.paths';
import { productSchemas } from './product.schemas';
import { userPaths } from './user.paths';
import { userSchemas } from './user.schemas';
import { userInteractionPaths } from './userInteractions.paths';

export const v1SwaggerConfig = {
  ...baseSwaggerConfig,
  info: {
    ...baseSwaggerConfig.info,
    version: '1.0.0',
    description: 'Stable version 1 of the API',
  },
  servers: [{ url: `${baseSwaggerConfig.servers[0].url}/v1` }],
  paths: {
    ...authPaths,
    ...userPaths,
    ...commonPaths,
    ...userInteractionPaths,
    ...catalogPaths,
    ...productPaths,
  },
  components: {
    ...baseSwaggerConfig.components,
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
  },
};
