import express from "express";
import {
  getRisikoBanjir,
  getRisikoByDesa,
  updateRisikoByDesa,
  deleteRisiko
} from "../controllers/risikoController.js";
import {authMiddleware} from '../middleware/auth.js';

const router = express.Router();

router.get("/", getRisikoBanjir);
router.get("/:id", getRisikoByDesa);
router.patch("/:id", authMiddleware,updateRisikoByDesa);
router.delete('/:id', authMiddleware,deleteRisiko);

export default router;
