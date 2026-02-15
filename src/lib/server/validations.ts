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
  code: z.string().regex(/^\d{6}$/, "کد تایید باید ۶ رقم باشد"),
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
  addressId: z.string().min(1, "آدرس تحویل الزامی است").optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"]),
});

export const paymentRequestSchema = z.object({
  orderId: z.string().min(1),
});

// ── پروفایل کاربر ──

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, "نام باید حداقل ۲ حرف باشد").max(50).optional(),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ حرف باشد").max(50).optional(),
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  birthYear: z.number().int().min(1340).max(1410).optional().nullable(),
  birthMonth: z.number().int().min(1).max(12).optional().nullable(),
  birthDay: z.number().int().min(1).max(31).optional().nullable(),
  defaultOrderNote: z.string().max(300).optional().or(z.literal("")),
  smsOptIn: z.boolean().optional(),
  preferredPayment: z.enum(["ONLINE", "CASH", "CARD_ON_DELIVERY"]).optional().nullable(),
});

// ── آدرس ──

export const addressSchema = z.object({
  title: z.string().min(1, "عنوان آدرس الزامی است").max(50),
  province: z.string().min(2).max(50).default("تهران"),
  city: z.string().min(2).max(50).default("تهران"),
  neighborhood: z.string().min(2, "محله الزامی است").max(100),
  street: z.string().min(5, "آدرس کامل الزامی است").max(500),
  postalCode: z.string().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد").optional().or(z.literal("")),
  latitude: z.number().min(24).max(40).optional().nullable(),
  longitude: z.number().min(44).max(64).optional().nullable(),
  receiverName: z.string().max(100).optional().or(z.literal("")),
  receiverPhone: phoneSchema.optional().or(z.literal("")),
  isDefault: z.boolean().optional(),
});

// ── سفارش همیشگی ──

export const favoriteOrderSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است").max(100),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(20),
  })).min(1, "حداقل یک آیتم انتخاب کنید"),
});
