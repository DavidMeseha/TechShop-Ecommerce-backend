import express from 'express';
import v2 from './v2';
const router = express.Router();

router.use('/v2', v2);

export default router;
