import express from 'express';
import { getConversionFactors, performConversion } from '../controllers/conversionController.mjs';

const router = express.Router();

router.get('/factors', getConversionFactors);
router.post('/convert', performConversion);

export default router;
