// Import other v1 schemas and paths...

import { baseSwaggerConfig } from '../swaggerBaseConfig';
import { authPaths } from './auth.paths';
import { authSchemas } from './auth.schemas';
import { catalogPaths } from './catalog.paths';
import { catalogSchemas } from './catalog.schemas';
import { checkoutPaths } from './checkout.paths';
import { checkoutSchemas } from './checkout.schemas';
import { commonResponse, commonSchemas } from './common.schemas';
import { guestPaths } from './guest.paths';
import { productPaths } from './product.paths';
import { productSchemas } from './product.schemas';
import { userPaths } from './user.paths';
import { userSchemas } from './user.schemas';
import { userInteractionPaths } from './userInteractions.paths';

export const v2SwaggerConfig = {
  ...baseSwaggerConfig,
  info: {
    ...baseSwaggerConfig.info,
    version: '1.0.0',
    description: 'Stable version 1 of the API',
  },
  servers: [{ url: `${baseSwaggerConfig.servers[0].url}/v2` }],
  paths: {
    ...authPaths,
    ...userPaths,
    ...checkoutPaths,
    ...guestPaths,
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
      ...checkoutSchemas,
      ...productSchemas,
      ...catalogSchemas,
    },
    responses: {
      ...commonResponse,
    },
  },
};
