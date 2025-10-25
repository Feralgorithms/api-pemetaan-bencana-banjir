import express from "express";
import {
  getDaftarKecamatan,
  getKecamatanById,
  tambahKecamatan,
  updateKecamatan,
  deleteKecamatan
} from "../controllers/kecamatanController.js";

const router = express.Router();

router.get("/", getDaftarKecamatan);
router.get("/:id", getKecamatanById);
router.post("/", tambahKecamatan); 
router.patch("/update/:id", updateKecamatan);
router.delete('/kecamatan/:id', deleteKecamatan);

export default router;
