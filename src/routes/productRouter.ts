import { Router } from 'express';
import {
  getProductAtterputes,
  getProductDetails,
  getReviews,
} from '../controllers/product.controller';
import express from 'express';

const router: Router = express.Router();

router.get('/attributes/:id', getProductAtterputes);
router.get('/reviews/:id', getReviews);
router.get('/details/:seName', getProductDetails);

export default router;
