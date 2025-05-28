import express from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import catalogRouter from './catalog.router';
import vendorCatalogRouter from './vendor.router';
import tagCatalogRouter from './tag.router';
import categoryCatalogRouter from './category.router';
import discoverCatalogRouter from './discover.router';
import { fetchUser } from '@/middlewares/auth.middleware';

const router = express.Router();

router.use('/', fetchUser, asyncHandler(catalogRouter));
router.use('/vendor', fetchUser, asyncHandler(vendorCatalogRouter));
router.use('/tag', fetchUser, asyncHandler(tagCatalogRouter));
router.use('/category', fetchUser, asyncHandler(categoryCatalogRouter));
router.use('/discover', fetchUser, asyncHandler(discoverCatalogRouter));

export default router;
