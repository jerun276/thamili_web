"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData: FormData) {
  const supabase = await createClient();

  const productData = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    category: formData.get("category") as string,
    price_germany: parseFloat(formData.get("price_germany") as string),
    price_denmark: parseFloat(formData.get("price_denmark") as string),
    stock_germany: parseInt(formData.get("stock_germany") as string),
    stock_denmark: parseInt(formData.get("stock_denmark") as string),
    active: formData.get("active") === "true",
    image_url: (formData.get("image_url") as string) || null,
  };

  const { error } = await supabase.from("products").insert(productData);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProductAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const productData = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    category: formData.get("category") as string,
    price_germany: parseFloat(formData.get("price_germany") as string),
    price_denmark: parseFloat(formData.get("price_denmark") as string),
    stock_germany: parseInt(formData.get("stock_germany") as string),
    stock_denmark: parseInt(formData.get("stock_denmark") as string),
    active: formData.get("active") === "true",
    image_url: (formData.get("image_url") as string) || null,
  };

  const { error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProductAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function toggleProductActiveAction(id: string, active: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ active })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}
