import express from 'express';
import { getDaftarKecamatan, getKecamatanById } from '../controllers/kecamatanController.js';

const router = express.Router();

router.get('/', getDaftarKecamatan);

router.get('/:id', getKecamatanById);

export default router;
