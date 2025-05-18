import {
  getAllCategoriesSeName,
  getAllTagsSeName,
  getAllVendorsSeName,
  getCategories,
  getCategoryInfo,
  getCategoryProducts,
  getSinglProduct,
  getTagInfo,
  getTagProducts,
  getTags,
  getVendorInfo,
  getVendorProducts,
  getVendors,
  homeFeed,
} from '../controllers/catalog';
import express from 'express';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.get('/product/:id', asyncHandler(getSinglProduct));
router.get('/homefeed', asyncHandler(homeFeed));
router.get('/discover/vendors', asyncHandler(getVendors));
router.get('/discover/tags', asyncHandler(getTags));
router.get('/discover/categories', getCategories);
router.get('/vendor/:seName', asyncHandler(getVendorInfo));
router.get('/vendorProducts/:id', asyncHandler(getVendorProducts));
router.get('/tag/:seName', asyncHandler(getTagInfo));
router.get('/tagProducts/:id', asyncHandler(getTagProducts));
router.get('/category/:seName', asyncHandler(getCategoryInfo));
router.get('/categoryProducts/:id', asyncHandler(getCategoryProducts));
router.get('/allVendors', asyncHandler(getAllVendorsSeName));
router.get('/allCategories', asyncHandler(getAllCategoriesSeName));
router.get('/allTags', asyncHandler(getAllTagsSeName));

export default router;
