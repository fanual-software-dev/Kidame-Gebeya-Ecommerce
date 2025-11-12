import { Router } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../controllers/product.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Admin-only routes
router.post("/", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
