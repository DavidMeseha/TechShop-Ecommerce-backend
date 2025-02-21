import {
  getAllCategoriesSeName,
  getAllTagsSeName,
  getAllVendorsSeName,
  getCategories,
  getCategoryInfo,
  getCategoryProducts,
  getSingleProduct,
  getTagInfo,
  getTagProducts,
  getTags,
  getVendorInfo,
  getVendorProducts,
  getVendors,
  homeFeed,
} from '../controllers/catalog.controller';
import express from 'express';

const router = express.Router();

router.get('/product/:id', getSingleProduct);
router.get('/homefeed', homeFeed);
router.get('/discover/vendors', getVendors);
router.get('/discover/tags', getTags);
router.get('/discover/categories', getCategories);
router.get('/vendor/:seName', getVendorInfo);
router.get('/vendorProducts/:id', getVendorProducts);
router.get('/tag/:seName', getTagInfo);
router.get('/tagProducts/:id', getTagProducts);
router.get('/category/:seName', getCategoryInfo);
router.get('/categoryProducts/:id', getCategoryProducts);
router.get('/allVendors', getAllVendorsSeName);
router.get('/allCategories', getAllCategoriesSeName);
router.get('/allTags', getAllTagsSeName);

export default router;
