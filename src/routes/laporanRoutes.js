import express from 'express';
import { tambahLaporan, getLaporan, getAllLaporan, updateLaporan,deleteLaporan } from '../controllers/laporanController.js';
import {authMiddleware} from '../middleware/auth.js';

const router = express.Router();

router.post('/', tambahLaporan);
router.patch('/update/:id', authMiddleware,updateLaporan);
router.get('/', getLaporan);
router.get('/all', getAllLaporan);
router.delete('/:id', authMiddleware,deleteLaporan);

export default router;
