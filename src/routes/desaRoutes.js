import express from 'express';
import { getSemuaDesa, getDesaByKecamatan, getDesaByKode, tambahDesa, updateDesa } from '../controllers/desaController.js';

const router = express.Router();

router.get('/', getSemuaDesa);
router.get('/kecamatan/:id_kecamatan', getDesaByKecamatan);
router.get('/:kode_desa', getDesaByKode);
router.post("/desa", tambahDesa);
router.patch("/desa/:kode_desa", updateDesa);


export default router;
