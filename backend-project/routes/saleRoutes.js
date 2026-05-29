import express from "express";
import {
  createSale,
  getSales,
  getSale,
  updateSale,
  deleteSale,
} from "../controllers/saleController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/", createSale);
router.get("/", getSales);
router.get("/:invoiceNumber", getSale);
router.put("/:invoiceNumber", updateSale);
router.delete("/:invoiceNumber", deleteSale);

export default router;
