import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:productCode", getProduct);
router.put("/:productCode", updateProduct);
router.delete("/:productCode", deleteProduct);

export default router;
