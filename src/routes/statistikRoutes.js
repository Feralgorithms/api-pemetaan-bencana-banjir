import express from "express";
import { getStatistikUser } from "../controllers/statistikController.js";

const router = express.Router();
router.get("/", getStatistikUser);

export default router;
