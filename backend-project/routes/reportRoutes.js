import express from "express";
import {
  getDailySalesReport,
  getWeeklySalesReport,
  getMonthlySalesReport,
  getSalesSummary,
} from "../controllers/reportController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/daily", getDailySalesReport);
router.get("/weekly", getWeeklySalesReport);
router.get("/monthly", getMonthlySalesReport);
router.get("/summary", getSalesSummary);

export default router;
