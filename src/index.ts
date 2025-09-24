import './config/alias.config';
import initializeApp from './config/app.config';
import express from 'express';

const app = express();
initializeApp(app);

export default app;
