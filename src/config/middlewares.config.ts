import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors, { CorsOptions } from 'cors';
import express, { Application } from 'express';
import path from 'path';
import { DOMAIN, ORIGINS } from './env.config';
// import { setupCsrf } from '../middlewares/csrf.middleware';

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
  app.use(cors(configureCors()));

  app.use(cookieParser());
  // app.use(setupCsrf);
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '../../public')));
  app.use('/images', express.static('../../public/images'));
}
