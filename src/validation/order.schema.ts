import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const createOrderSchema = z.array(orderItemSchema);

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
