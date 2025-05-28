import express from 'express';
import { removeAddress, editAdress, newAdress } from '@/controllers/v1/user';
import { asyncHandler } from '@/utils/asyncHandler';

const router = express.Router();

router.post('/add', asyncHandler(newAdress));
router.delete('/delete/:id', asyncHandler(removeAddress));
router.put('/edit/:id', asyncHandler(editAdress));

export default router;
