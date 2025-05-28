import { Router } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { getCities, getCountries } from '@/controllers/v1/common';

const router = Router();

router.get('/countries', asyncHandler(getCountries));
router.get('/cities/:id', asyncHandler(getCities));

export default router;
