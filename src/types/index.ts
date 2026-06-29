export type UserRole = "customer" | "admin" | "delivery_partner";

export type Country = "germany" | "denmark";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "out_for_delivery"
  | "delivered"
  | "canceled";

export type PaymentMethod = "online" | "cod";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type DeliveryMethod = "home" | "pickup";

export type OrderType = "regular" | "van_sale";

export type ProductCategory = "fresh" | "frozen";

export interface User {
  id: string;
  email: string;
  username?: string;
  name: string;
  phone?: string;
  role: UserRole;
  country_preference: Country;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  price_germany: number;
  price_denmark: number;
  stock_germany: number;
  stock_denmark: number;
  image_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_date: string;
  status: OrderStatus;
  total_amount: number;
  country: Country;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  pickup_point_id?: string;
  delivery_address?: string;
  delivery_method: DeliveryMethod;
  order_type: OrderType;
  delivery_partner_id?: string;
  created_at: string;
  updated_at: string;
  user?: User;
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
  product?: Product;
}

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  country: Country;
  delivery_fee: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeliveryPartner {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  read: boolean;
  data?: Record<string, unknown>;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label?: string;
  address_line: string;
  city: string;
  postal_code: string;
  country: Country;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
