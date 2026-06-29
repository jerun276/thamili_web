"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const email = `${username}@thamili.app`;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user!.id)
    .single();

  const role = userData?.role || "customer";

  if (role === "admin") {
    redirect("/en/admin/dashboard");
  } else if (role === "delivery_partner") {
    redirect("/en/delivery/dashboard");
  } else {
    redirect("/en/products");
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/api/create-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, username, phone, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    return { error: result.error || "Registration failed" };
  }

  const supabase = await createClient();
  const email = `${username}@thamili.app`;

  await supabase.auth.signInWithPassword({ email, password });

  redirect("/en/products");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/en/login");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
