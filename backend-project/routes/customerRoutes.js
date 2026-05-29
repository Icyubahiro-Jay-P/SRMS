import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/", createCustomer);
router.get("/", getCustomers);
router.get("/:customerNumber", getCustomer);
router.put("/:customerNumber", updateCustomer);
router.delete("/:customerNumber", deleteCustomer);

export default router;
