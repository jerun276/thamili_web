export type UserRole = "customer" | "admin" | "delivery_partner";

export type Country = "germany" | "denmark";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "card" | "cod";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type DeliveryMethod = "home" | "pickup";

export type OrderType = "online" | "van_sale";

export type ProductCategory = "fresh" | "frozen";

export type SellType = "pack" | "loose";

export interface User {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  phone: string | null;
  role: UserRole;
  country_preference: Country | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  price_germany: number;
  price_denmark: number;
  base_price_germany: number | null;
  base_price_denmark: number | null;
  stock_germany: number;
  stock_denmark: number;
  image_url: string | null;
  active: boolean;
  active_germany: boolean | null;
  active_denmark: boolean | null;
  is_deleted: boolean | null;
  sell_type: SellType | null;
  unit: string | null;
  pack_size_grams: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  order_date: string;
  status: OrderStatus;
  total_amount: number;
  delivery_fee: number | null;
  payment_fee: number | null;
  country: Country;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_intent_id: string | null;
  pickup_point_id: string | null;
  delivery_address: string | null;
  delivery_method: DeliveryMethod | null;
  order_type: OrderType | null;
  notes: string | null;
  idempotency_key: string | null;
  created_at: string | null;
  updated_at: string | null;
  users?: User;
  order_items?: OrderItem[];
  pickup_point?: PickupPoint;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string | null;
  product?: Product;
}

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  country: Country;
  delivery_fee: number;
  base_delivery_fee: number | null;
  free_delivery_radius: number | null;
  extra_km_fee: number | null;
  active: boolean;
  working_hours: string | null;
  contact_number: string | null;
  admin_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DeliverySchedule {
  id: string;
  order_id: string;
  delivery_partner_id: string | null;
  pickup_point_id: string | null;
  delivery_date: string;
  estimated_time: string | null;
  actual_delivery_time: string | null;
  status: string;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PaymentMethodRecord {
  id: string;
  user_id: string;
  stripe_payment_method_id: string;
  type: string | null;
  brand: string | null;
  last4: string | null;
  expiry_month: string | null;
  expiry_year: string | null;
  cardholder_name: string | null;
  is_default: boolean | null;
  created_at: string | null;
}

export interface Address {
  id: string;
  user_id: string;
  type: string | null;
  name: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  instructions: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  read: boolean | null;
  read_at: string | null;
  created_at: string | null;
}

export interface NotificationPreferences {
  user_id: string;
  push_enabled: boolean | null;
  order_notifications: boolean | null;
  delivery_notifications: boolean | null;
  payment_notifications: boolean | null;
  general_notifications: boolean | null;
  updated_at: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
