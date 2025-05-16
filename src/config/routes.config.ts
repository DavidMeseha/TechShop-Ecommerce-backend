import { Application } from 'express';
import { getCities, getCountries } from '../controllers/common/common.controller';
import authRouter from '../routes/auth.router';
import userRouter from '../routes/user.router';
import commonRouter from '../routes/common.router';
import catalogRouter from '../routes/catalog.router';
import productRouter from '../routes/product.router';
import { apiAuth, fetchUser, userAuth } from '../middlewares/auth.middleware';
import { DEFAULT_ORIGIN } from './env.config';

export default function configureRoutes(app: Application) {
  app.use('/api/common/countries', getCountries);
  app.use('/api/common/cities/:id', getCities);
  app.use('/api/auth', authRouter);
  app.use('/api/user', userAuth, userRouter);
  app.use('/api/common', apiAuth, commonRouter);
  app.use('/api/catalog', fetchUser, catalogRouter);
  app.use('/api/product', fetchUser, productRouter);

  app.use('/api/status', (_req, res) => res.status(200).json('Connected'));
  app.use('/', (_req, res) => res.redirect(DEFAULT_ORIGIN));
}
