import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors, { CorsOptions } from 'cors';
import swaggerUIPath from 'swagger-ui-express';
import swaggerjsonFilePath from '../../docs/swagger.json';
import express, { Application } from 'express';
import path from 'path';
import { ORIGINS } from './env.config';

function configureCors(): CorsOptions {
  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      if (ORIGINS.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`Origin ${origin} not allowed by CORS`);
        callback(new Error('Not allowed by CORS'));
      }
    },
  };
}

export default function configureMiddlewares(app: Application) {
  app.use(cors(configureCors()));
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use('/swagger', swaggerUIPath.serve, swaggerUIPath.setup(swaggerjsonFilePath));
  app.use(express.static(path.join(__dirname, '../public')));
  app.use('/images', express.static('../public/images'));
}
