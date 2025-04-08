import dotenv from 'dotenv';
dotenv.config();
import { HttpError } from 'http-errors';
import express, { Request, Response, Application } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors, { CorsOptions } from 'cors';
import cron from 'node-cron';
import swaggerUIPath from 'swagger-ui-express';
import swaggerjsonFilePath from '../docs/swagger.json';

// Routers
import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import commonRouter from './routes/commonRouter';
import catalogRouter from './routes/catalogsRouter';
import productRouter from './routes/productRouter';

// Middlewares
import { apiAuthMiddleware, getUser, userAuthMiddleware } from './middlewares/auth.middleware';

// Models
import { VendorSchema } from './models/Vendors';
import { CategorySchema } from './models/Categories';
import Users, { UserSchema } from './models/Users';
import { ProductReviewSchema } from './models/Reviews';
import { TagSchema } from './models/Tags';
import { CountrySchema } from './models/Countries';
import { CitySchema } from './models/Cities';
import { OrderSchema } from './models/Orders';

// Controllers
import { getCities, getCountries } from './controllers/common/common.controller';

// Utils
import useT, { Language } from './locales/useT';

// Constants
const PORT = process.env.PORT || 3000;
const origins = process.env.ORIGIN?.split(',') || [];
const DEFAULT_ORIGIN = process.env.ORIGIN?.split(',')[0] ?? '';

const configureCors = (): CorsOptions => ({
  origin: (origin, callback) => {
    if (!origin || origins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
});

const configureMiddlewares = (app: Application) => {
  app.use(cors(configureCors()));
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use('/swagger', swaggerUIPath.serve, swaggerUIPath.setup(swaggerjsonFilePath));
  app.use(express.static(path.join(__dirname, '../public')));
  app.use('/images', express.static('../public/images'));
};

const configureHeaders = (app: Application) => {
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origins.includes(origin ?? '')) {
      res.setHeader('Access-Control-Allow-Origin', origin ?? '');
    }
    next();
  });
};

const configureLocalization = (app: Application) => {
  app.use((req, res, next) => {
    res.locals.t = useT((req.headers['accept-language'] as Language) ?? 'en');
    next();
  });
};

const configureRoutes = (app: Application) => {
  app.use('/api/common/countries', getCountries);
  app.use('/api/common/cities/:id', getCities);
  app.use('/api/auth', authRouter);
  app.use('/api/user', userAuthMiddleware, userRouter);
  app.use('/api/common', apiAuthMiddleware, commonRouter);
  app.use('/api/catalog', getUser, catalogRouter);
  app.use('/api/product', getUser, productRouter);

  app.use('/api/status', (_req, res) => res.status(200).json('Connected'));
  app.use('/', (_req, res) => res.redirect(DEFAULT_ORIGIN));
};

const configureErrorHandling = (app: Application) => {
  // 404 handler
  app.use((_req: Request, res: Response) => {
    if (!DEFAULT_ORIGIN) {
      return res.status(404).render('error', { to: process.env.ORIGIN });
    }
  });

  // Error handler
  app.use((err: HttpError, req: Request, res: Response) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).render('error');
  });
};

const configureCronJobs = () => {
  // Remove users without passwords daily
  cron.schedule('0 0 * * *', async () => {
    const deleted = await Users.deleteMany({ password: null });
    console.log('Expired records deleted:', deleted);
  });
};

const initializeDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI ?? '');
    console.log('Database connected');

    // Initialize models
    mongoose.model('Vendors', VendorSchema);
    mongoose.model('Categories', CategorySchema);
    mongoose.model('Users', UserSchema);
    mongoose.model('Reviews', ProductReviewSchema);
    mongoose.model('Tags', TagSchema);
    mongoose.model('Countries', CountrySchema);
    mongoose.model('Cities', CitySchema);
    mongoose.model('Orders', OrderSchema);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

const initializeApp = async () => {
  const app: Application = express();

  // View engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  configureMiddlewares(app);
  configureHeaders(app);
  configureLocalization(app);
  configureRoutes(app);
  configureErrorHandling(app);

  await initializeDatabase();

  app.listen(PORT, () => {
    configureCronJobs();
    console.log(`Server listening on port ${PORT}`);
  });

  return app;
};

initializeApp();
