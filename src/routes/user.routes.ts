import { Router } from "express";
import {
  getProfile,
  getAllUsers,
  getUserById,
  deleteUser,
} from "../controllers/user.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Get current user's profile
router.get("/me", authenticate, getProfile);

// Admin routes
router.get("/", authenticate, authorizeAdmin, getAllUsers);
router.get("/:id", authenticate, authorizeAdmin, getUserById);
router.delete("/:id", authenticate, authorizeAdmin, deleteUser);

export default router;
