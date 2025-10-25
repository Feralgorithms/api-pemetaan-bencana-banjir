import express from "express";
import {
  getRisikoBanjir,
  getRisikoByDesa,
  updateRisikoByDesa,
  deleteRisiko
} from "../controllers/risikoController.js";

const router = express.Router();

router.get("/", getRisikoBanjir);
router.get("/:nama_desa", getRisikoByDesa);
router.patch("/:nama_desa", updateRisikoByDesa);
router.delete('/:id', deleteRisiko);

export default router;
