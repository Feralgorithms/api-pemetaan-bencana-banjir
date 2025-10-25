import express from 'express';
import { getSemuaDesa, getDesaByKecamatan, getDesaByKode, tambahDesa, updateDesa, deleteDesa } from '../controllers/desaController.js';

const router = express.Router();

router.get('/', getSemuaDesa);
router.get('/kecamatan/:id_kecamatan', getDesaByKecamatan);
router.get('/:kode_desa', getDesaByKode);
router.post("/", tambahDesa);
router.patch("/update/:kode_desa", updateDesa);
router.delete('/:kode_desa', deleteDesa);


export default router;
