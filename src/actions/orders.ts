"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/types";

export async function createOrderAction(orderData: {
  user_id: string;
  items: { product_id: string; quantity: number; price: number }[];
  total_amount: number;
  country: string;
  payment_method: string;
  delivery_method: string;
  delivery_address?: string;
  pickup_point_id?: string;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== orderData.user_id) {
    return { error: "Unauthorized" };
  }

  const stockField = orderData.country === "denmark" ? "stock_denmark" : "stock_germany";

  const productIds = orderData.items.map((item) => item.product_id);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, stock_germany, stock_denmark")
    .in("id", productIds);

  if (productsError || !products) {
    return { error: "Failed to check product availability" };
  }

  for (const item of orderData.items) {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) {
      return { error: `Product not found` };
    }
    const availableStock = Number(product[stockField]);
    if (availableStock < item.quantity) {
      return { error: `Insufficient stock for "${product.name}". Available: ${availableStock}` };
    }
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: orderData.user_id,
      total_amount: orderData.total_amount,
      country: orderData.country,
      payment_method: orderData.payment_method,
      delivery_method: orderData.delivery_method,
      delivery_address: orderData.delivery_address,
      pickup_point_id: orderData.pickup_point_id,
      status: "pending",
      payment_status: "pending",
      order_type: "regular",
      order_date: new Date().toISOString().split("T")[0],
    })
    .select()
    .single();

  if (orderError) {
    return { error: orderError.message };
  }

  const orderItems = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    return { error: itemsError.message };
  }

  for (const item of orderData.items) {
    const product = products.find((p) => p.id === item.product_id)!;
    const newStock = Number(product[stockField]) - item.quantity;
    await supabase
      .from("products")
      .update({ [stockField]: newStock })
      .eq("id", item.product_id);
  }

  revalidatePath("/orders");
  return { success: true, orderId: order.id };
}

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Only admins can update order status" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  return { success: true };
}

export async function cancelOrderAction(orderId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: order } = await supabase
    .from("orders")
    .select("user_id, status")
    .eq("id", orderId)
    .single();

  if (!order) return { error: "Order not found" };

  if (order.user_id !== user.id) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { error: "Not authorized to cancel this order" };
    }
  }

  if (order.status !== "pending") {
    return { error: "Only pending orders can be cancelled" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/orders");
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function assignDeliveryPartnerAction(orderId: string, partnerId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Only admins can assign delivery partners" };
  }

  const { data: existing } = await supabase
    .from("delivery_schedule")
    .select("id")
    .eq("order_id", orderId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("delivery_schedule")
      .update({
        delivery_partner_id: partnerId,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);

    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase
      .from("delivery_schedule")
      .insert({
        order_id: orderId,
        delivery_partner_id: partnerId,
        delivery_date: new Date().toISOString().split("T")[0],
        status: "assigned",
      });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath("/delivery/deliveries");
  return { success: true };
}
