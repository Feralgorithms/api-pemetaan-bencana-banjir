import express from "express";
import {
  getRisikoBanjir,
  getRisikoByDesa,
  updateRisikoByDesa
} from "../controllers/risikoController.js";

const router = express.Router();

router.get("/", getRisikoBanjir);
router.get("/:nama_desa", getRisikoByDesa);
router.patch("/:nama_desa", updateRisikoByDesa);

export default router;
