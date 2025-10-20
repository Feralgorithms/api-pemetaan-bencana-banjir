import express from 'express';
import { getSungaiByKecamatan } from '../controllers/sungaiController.js';

const router = express.Router();


router.get('/kecamatan/:id', getSungaiByKecamatan);

export default router;
