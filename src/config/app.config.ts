import { Application } from 'express';
import path from 'path';

import configureMiddlewares from './middlewares.config';
import configureLocalization from './localization.config';
import configureRoutes from './routes.config';
import configureCronJobs from './cronJobs.config';
import initializeDatabase from './db.config';
import configureErrorHandling from './error.config';
import { PORT } from './env.config';

export default async function initializeApp(app: Application) {
  // View engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  configureMiddlewares(app);
  configureLocalization(app);
  configureRoutes(app);
  configureErrorHandling(app);

  await initializeDatabase();

  app.listen(PORT, () => {
    configureCronJobs();
    console.log(`Server listening on port ${PORT}`);
  });
}
