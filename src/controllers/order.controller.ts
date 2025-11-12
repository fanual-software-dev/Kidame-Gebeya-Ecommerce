import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createOrderSchema } from "../validation/order.schema";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    // Validate input
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const orderItems = parsed.data;

    // Start Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      let totalPrice = 0;
      const orderProducts: any[] = [];

      for (const item of orderItems) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        // Decrease stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });

        totalPrice += product.price * item.quantity;

        orderProducts.push({
          productId: product.id,
          quantity: item.quantity,
        });
      }

      // Create the order
      const order = await tx.order.create({
        data: {
          userId: req.user!.userId,
          description: `Order for ${orderProducts.length} items`,
          totalPrice,
          status: "PENDING",
        },
      });

      // Create order-product relations
      await tx.orderProduct.createMany({
        data: orderProducts.map((p) => ({
          orderId: order.id,
          productId: p.productId,
          quantity: p.quantity,
        })),
      });

      return order;
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      object: result,
    });
  } catch (error: any) {
    if (error.message.includes("Insufficient stock") || error.message.includes("not found")) {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user?.userId },
      include: {
        products: {
          include: { product: { select: { name: true, price: true, category: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      message: "Orders fetched successfully",
      object: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
