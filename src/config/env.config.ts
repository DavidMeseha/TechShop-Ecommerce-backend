import dotenv from 'dotenv';
dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;
export const DB_URI = process.env.DB_URI;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const STRIPE_SECRET = process.env.STRIPE_SECRET;
export const DOMAIN = process.env.DOMAIN;
export const FILES_READ_WRITE_TOKEN = process.env.FILES_READ_WRITE_TOKEN;
export const ORIGINS = process.env.ORIGINS
  ? process.env.ORIGINS.split(',').map((origin) => origin.trim())
  : [];

export const DEFAULT_ORIGIN = ORIGINS[0];
export const DEFAULT_IMAGE = `${DOMAIN}/images/no_image_placeholder.jpg`;
export const DEFAULT_PROFILE_IMAGE = `${DOMAIN}/images/profile_placeholder.jpg`;
