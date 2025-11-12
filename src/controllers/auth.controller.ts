import { Request, Response } from "express";
import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/token";
import { registerSchema, loginSchema } from "../validation/auth.schema";

export const register = async (req: Request, res: Response) => {
  try {
    // Zod validation
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((err) => err.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const { username, email, password } = parsed.data;

    // Check duplicates
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: "Username or email already exists" });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { username, email, password: hashed },
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      object: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Zod validation
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((err) => err.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken({ userId: user.id, username: user.username, role: user.role });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      object: { token },
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
