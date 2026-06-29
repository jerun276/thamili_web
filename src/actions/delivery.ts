"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateDeliveryStatusAction(
  orderId: string,
  status: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/delivery/deliveries");
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function createVanSaleAction(orderData: {
  delivery_partner_id: string;
  items: { product_id: string; quantity: number; price: number }[];
  total_amount: number;
  country: string;
}) {
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: orderData.delivery_partner_id,
      total_amount: orderData.total_amount,
      country: orderData.country,
      payment_method: "cod",
      delivery_method: "home",
      status: "delivered",
      payment_status: "paid",
      order_type: "van_sale",
      delivery_partner_id: orderData.delivery_partner_id,
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

  revalidatePath("/delivery/van-sales");
  return { success: true, orderId: order.id };
}
