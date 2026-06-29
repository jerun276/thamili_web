"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendNotificationAction(formData: FormData) {
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const userId = formData.get("userId") as string;
  const broadcast = formData.get("broadcast") === "true";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const internalSecret = process.env.INTERNAL_API_SECRET;

  if (broadcast) {
    const supabase = await createClient();
    const { data: users } = await supabase
      .from("users")
      .select("id")
      .eq("role", "customer");

    if (users) {
      const results = await Promise.allSettled(
        users.map((user) =>
          fetch(`${apiUrl}/api/send-push`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-secret": internalSecret || "",
            },
            body: JSON.stringify({ userId: user.id, title, body }),
          })
        )
      );
      const sent = results.filter((r) => r.status === "fulfilled").length;
      return { success: true, sent };
    }

    return { error: "No users found" };
  }

  if (!userId) {
    return { error: "User ID is required for non-broadcast notifications" };
  }

  const response = await fetch(`${apiUrl}/api/send-push`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": internalSecret || "",
    },
    body: JSON.stringify({ userId, title, body }),
  });

  if (!response.ok) {
    const result = await response.json();
    return { error: result.error || "Failed to send notification" };
  }

  revalidatePath("/admin/notifications");
  return { success: true, sent: 1 };
}
