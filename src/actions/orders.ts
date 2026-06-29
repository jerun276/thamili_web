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
      payment_status: orderData.payment_method === "cod" ? "pending" : "pending",
      order_type: "regular",
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

  revalidatePath("/orders");
  return { success: true, orderId: order.id };
}

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  const supabase = await createClient();

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

  const { error } = await supabase
    .from("orders")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
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

  const { error } = await supabase
    .from("orders")
    .update({
      delivery_partner_id: partnerId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/delivery/deliveries");
  return { success: true };
}
