import { Application } from 'express';
import { ORIGINS } from './env.config';

export default function configureHeaders(app: Application) {
  app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (ORIGINS.includes(origin ?? '')) {
      res.setHeader('Access-Control-Allow-Origin', origin ?? '');
    }
    next();
  });
}
