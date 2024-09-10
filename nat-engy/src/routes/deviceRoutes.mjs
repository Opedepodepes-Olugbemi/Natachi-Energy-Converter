import express from 'express';
import { getAllDevices, addDevice, removeDevice } from '../controllers/deviceController.mjs';

const router = express.Router();

router.get('/', getAllDevices);
router.post('/', addDevice);
router.delete('/:id', removeDevice);

export default router;
