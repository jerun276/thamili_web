import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  category: z.enum(["fresh", "frozen"]),
  price_germany: z.number().min(0, "Price must be positive"),
  price_denmark: z.number().min(0, "Price must be positive"),
  stock_germany: z.number().int().min(0, "Stock must be 0 or more"),
  stock_denmark: z.number().int().min(0, "Stock must be 0 or more"),
  active: z.boolean(),
});

export const addressSchema = z.object({
  label: z.string().optional(),
  address_line: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.enum(["germany", "denmark"]),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  is_default: z.boolean().default(false),
});

export const pickupPointSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number(),
  longitude: z.number(),
  country: z.enum(["germany", "denmark"]),
  delivery_fee: z.number().min(0, "Delivery fee must be positive"),
  active: z.boolean(),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const notificationSchema = z.object({
  userId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Message is required"),
  broadcast: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type PickupPointInput = z.infer<typeof pickupPointSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type NotificationInput = z.infer<typeof notificationSchema>;
