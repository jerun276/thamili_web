"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPickupPointAction(formData: FormData) {
  const supabase = await createClient();

  const data = {
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    latitude: parseFloat(formData.get("latitude") as string),
    longitude: parseFloat(formData.get("longitude") as string),
    country: formData.get("country") as string,
    delivery_fee: parseFloat(formData.get("delivery_fee") as string),
    active: formData.get("active") === "true",
  };

  const { error } = await supabase.from("pickup_points").insert(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/pickup-points");
  return { success: true };
}

export async function updatePickupPointAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const data = {
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    latitude: parseFloat(formData.get("latitude") as string),
    longitude: parseFloat(formData.get("longitude") as string),
    country: formData.get("country") as string,
    delivery_fee: parseFloat(formData.get("delivery_fee") as string),
    active: formData.get("active") === "true",
  };

  const { error } = await supabase
    .from("pickup_points")
    .update(data)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/pickup-points");
  return { success: true };
}

export async function deletePickupPointAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("pickup_points").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/pickup-points");
  return { success: true };
}
