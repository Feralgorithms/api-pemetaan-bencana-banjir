import express from 'express';
import { getSemuaDesa, getDesaByKecamatan, getDesaByKode, tambahDesa, updateDesa, deleteDesa } from '../controllers/desaController.js';
import {authMiddleware} from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSemuaDesa);
router.get('/kecamatan/:id_kecamatan', getDesaByKecamatan);
router.get('/:kode_desa', getDesaByKode);
router.post("/", authMiddleware,tambahDesa);
router.patch("/update/:kode_desa", authMiddleware,updateDesa);
router.delete('/:kode_desa', authMiddleware,deleteDesa);

export default router;
