import express from "express";
import {
  getDaftarKecamatan,
  getKecamatanById,
  tambahKecamatan,
  updateKecamatan,
  deleteKecamatan
} from "../controllers/kecamatanController.js";
import {authMiddleware} from '../middleware/auth.js';

const router = express.Router();

router.get("/", getDaftarKecamatan);
router.get("/:id",getKecamatanById);
router.post("/", authMiddleware,tambahKecamatan); 
router.patch("/update/:id", authMiddleware,updateKecamatan);
router.delete('/kecamatan/:id', authMiddleware,deleteKecamatan);

export default router;
