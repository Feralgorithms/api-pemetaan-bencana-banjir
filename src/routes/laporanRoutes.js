import express from 'express';
import { tambahLaporan, getLaporan, getAllLaporan, updateLaporan,deleteLaporan } from '../controllers/laporanController.js';

const router = express.Router();

router.post('/', tambahLaporan);
router.patch('/update/:id', updateLaporan);
router.get('/', getLaporan);
router.get('/all', getAllLaporan);
router.delete('/:id', deleteLaporan);

export default router;
