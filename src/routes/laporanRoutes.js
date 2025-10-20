import express from 'express';
import { tambahLaporan, getLaporan } from '../controllers/laporanController.js';

const router = express.Router();

router.post('/', tambahLaporan);
router.get('/', getLaporan);

export default router;
