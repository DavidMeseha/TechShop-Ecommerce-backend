import { Application, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { DEFAULT_ORIGIN } from './env.config';

export default function configureErrorHandling(app: Application) {
  // 404 handler
  app.use((_req: Request, res: Response) => {
    if (!DEFAULT_ORIGIN) {
      return res.status(404).render('error', { to: DEFAULT_ORIGIN });
    }
  });

  // Error handler
  app.use((err: HttpError, _req: Request, res: Response) => {
    res.status(err.status || 500).render('error');
  });
}
