import express from "express";
import {
  getRisikoBanjir,
  getRisikoByDesa,
  updateRisikoByDesa,
  deleteRisiko
} from "../controllers/risikoController.js";

const router = express.Router();

router.get("/", getRisikoBanjir);
router.get("/:id", getRisikoByDesa);
router.patch("/:id", updateRisikoByDesa);
router.delete('/:id', deleteRisiko);

export default router;
