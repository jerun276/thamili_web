"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function removeDeliveryPartnerAction(partnerId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Only admins can remove delivery partners" };
  }

  const { error } = await supabase
    .from("users")
    .update({ role: "customer" })
    .eq("id", partnerId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/delivery-partners");
  return { success: true };
}
