import cors, { CorsOptions } from 'cors';
import { DOMAIN, ORIGINS } from './env.config';

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

export default cors(configureCors());
