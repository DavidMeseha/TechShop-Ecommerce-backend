import { Application } from 'express';
import { getCities, getCountries } from '@/controllers/v1/common/common.controller';
import authRouter from '@/routes/api/v1/auth.router';
import userRouter from '@/routes/api/v1/user.router';
import orderRouter from '@/routes/api/v1/checkout.router';
import commonRouter from '@/routes/api/v1/common.router';
import catalogRouter from '@/routes/api/v1/catalog.router';
import productRouter from '@/routes/api/v1/product.router';
import { apiAuth, fetchUser, userAuth } from '@/middlewares/auth.middleware';
import { DEFAULT_ORIGIN } from './env.config';
import { asyncHandler } from '@/utils/asyncHandler';
import swaggerUi from 'swagger-ui-express';
import api from '@/routes/api';
import { swaggerSpecs } from './swagger.config';

export default function configureRoutes(app: Application) {
  app.use('/api', api); //v2 api

  //old API (V1)
  app.use('/api/common/countries', asyncHandler(getCountries));
  app.use('/api/common/cities/:id', asyncHandler(getCities));
  app.use('/api/auth', asyncHandler(authRouter));
  app.use('/api/user', asyncHandler(userAuth), asyncHandler(userRouter));
  app.use('/api/checkout', asyncHandler(userAuth), asyncHandler(orderRouter));
  app.use('/api/common', asyncHandler(apiAuth), asyncHandler(commonRouter));
  app.use('/api/catalog', asyncHandler(fetchUser), asyncHandler(catalogRouter));
  app.use('/api/product', asyncHandler(fetchUser), asyncHandler(productRouter));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  app.use('/api/status', (_req, res) => res.status(200).json('Connected'));
  app.use('/', (_req, res) => res.redirect(DEFAULT_ORIGIN));
}
