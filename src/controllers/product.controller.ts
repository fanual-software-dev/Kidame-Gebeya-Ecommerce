import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createProductSchema, updateProductSchema } from "../validation/product.schema";

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const result = createProductSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const { name, description, price, stock, category } = result.data;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        category,
        userId: req.user?.userId || "", // admin who created it
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      object: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const result = updateProductSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: result.data,
    });

    res.json({
      success: true,
      message: "Product updated successfully",
      object: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          name: { contains: search, mode: "insensitive" },
        },
        skip,
        take: limit,
      }),
      prisma.product.count({
        where: { name: { contains: search, mode: "insensitive" } },
      }),
    ]);

    res.json({
      success: true,
      message: "Products fetched successfully",
      object: products,
      pageNumber: page,
      pageSize: limit,
      totalSize: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product fetched successfully",
      object: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
