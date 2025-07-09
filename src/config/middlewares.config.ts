import cookieParser from 'cookie-parser';
import logger from 'morgan';
import express, { Application } from 'express';
import path from 'path';
import limiterConfig from './limiter.config';
import configureCors from './cors.config';

export default function configureMiddlewares(app: Application) {
  app.use(limiterConfig);
  app.use(configureCors);

  app.use(cookieParser());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '../../public')));
  app.use('/images', express.static('../../public/images'));
}
