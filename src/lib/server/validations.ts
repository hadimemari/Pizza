import { z } from "zod";

// ──────────────────────────────────────────
// Zod Schemas - Input Validation
// ──────────────────────────────────────────

export const phoneSchema = z
  .string()
  .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09123456789)");

export const otpSendSchema = z.object({
  phone: phoneSchema,
});

export const otpVerifySchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6, "کد تایید باید ۶ رقمی باشد"),
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد").max(100).optional(),
});

export const productCreateSchema = z.object({
  name: z.string().min(2).max(200),
  price: z.number().int().positive(),
  description: z.string().min(10).max(1000),
  image: z.string().min(1),
  ingredients: z.array(z.string()),
  isAvailable: z.boolean().optional(),
  categoryId: z.string().min(1),
});

export const productUpdateSchema = productCreateSchema.partial();

export const cartAddSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export const cartUpdateSchema = z.object({
  quantity: z.number().int().min(0).max(20), // 0 = remove
});

export const orderCreateSchema = z.object({
  note: z.string().max(500).optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"]),
});

export const paymentRequestSchema = z.object({
  orderId: z.string().min(1),
});
