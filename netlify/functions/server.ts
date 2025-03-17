import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import routes
import authRouter from '../../src/routes/authRouter';
import catalogsRouter from '../../src/routes/catalogsRouter';
import commonRouter from '../../src/routes/commonRouter';
import productRouter from '../../src/routes/productRouter';
import userRouter from '../../src/routes/userRouter';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shop')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/catalogs', catalogsRouter);
app.use('/api/common', commonRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

// Health check route
app.get('/.netlify/functions/server', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Export handler for serverless
export const handler = serverless(app);