import { Application, Request, Response } from 'express';
import { DEFAULT_ORIGIN } from './env.config';
import { errorHandler } from '../middlewares/error.middleware';

export default function configureErrorHandling(app: Application) {
  app.use(errorHandler);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    if (!DEFAULT_ORIGIN) {
      return res.status(404).render('error', { to: DEFAULT_ORIGIN });
    }
  });
}
