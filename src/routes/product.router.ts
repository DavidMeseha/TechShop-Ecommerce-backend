import { Router } from 'express';
import {
  getProductAttributes,
  getProductDetails,
  getReviews,
} from '../controllers/product.controller';
import express from 'express';

const router: Router = express.Router();

router.get('/attributes/:id', getProductAttributes);
router.get('/reviews/:id', getReviews);
router.get('/details/:seName', getProductDetails);
router.get('/actions/:seName', getProductDetails);

export default router;
