import express from 'express';
import { getSemuaDesa, getDesaByKecamatan, getDesaByKode } from '../controllers/desaController.js';

const router = express.Router();

router.get('/', getSemuaDesa);
router.get('/kecamatan/:id_kecamatan', getDesaByKecamatan);
router.get('/:kode_desa', getDesaByKode);

export default router;
