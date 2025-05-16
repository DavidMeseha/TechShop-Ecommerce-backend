import { Application } from 'express';
import useT, { Language } from '../locales/useT';

export default function configureLocalization(app: Application) {
  app.use((req, res, next) => {
    res.locals.t = useT((req.headers['accept-language'] as Language) ?? 'en');
    next();
  });
}
