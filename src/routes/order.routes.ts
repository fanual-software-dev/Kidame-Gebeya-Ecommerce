import { Router } from "express";
import { createOrder, getMyOrders } from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Place new order
router.post("/", authenticate, createOrder);

// Get my orders
router.get("/", authenticate, getMyOrders);

export default router;
