import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors, { CorsOptions } from 'cors';
import express, { Application } from 'express';
import path from 'path';
import { DOMAIN, ORIGINS } from './env.config';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

function configureCors(): CorsOptions {
  return {
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (ORIGINS.indexOf(origin) !== -1 || origin === DOMAIN) {
        callback(null, true);
      } else {
        console.log(`Origin ${origin} not allowed by CORS`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  };
}

export default function configureMiddlewares(app: Application) {
  app.use(limiter);
  app.use(cors(configureCors()));

  app.use(cookieParser());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '../../public')));
  app.use('/images', express.static('../../public/images'));
}
