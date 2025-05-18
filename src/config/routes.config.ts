import { Application } from 'express';
import { getCities, getCountries } from '../controllers/common/common.controller';
import authRouter from '../routes/auth.router';
import userRouter from '../routes/user.router';
import commonRouter from '../routes/common.router';
import catalogRouter from '../routes/catalog.router';
import productRouter from '../routes/product.router';
import { apiAuth, fetchUser, userAuth } from '../middlewares/auth.middleware';
import { DEFAULT_ORIGIN } from './env.config';
import { asyncHandler } from '../utils/asyncHandler';

export default function configureRoutes(app: Application) {
  app.use('/api/common/countries', asyncHandler(getCountries));
  app.use('/api/common/cities/:id', asyncHandler(getCities));
  app.use('/api/user', asyncHandler(userAuth), asyncHandler(userRouter));
  app.use('/api/auth', asyncHandler(authRouter));
  app.use('/api/common', asyncHandler(apiAuth), asyncHandler(commonRouter));
  app.use('/api/catalog', asyncHandler(fetchUser), asyncHandler(catalogRouter));
  app.use('/api/product', asyncHandler(fetchUser), asyncHandler(productRouter));

  app.use('/api/status', (_req, res) => res.status(200).json('Connected'));
  app.use('/', (_req, res) => res.redirect(DEFAULT_ORIGIN));
}
