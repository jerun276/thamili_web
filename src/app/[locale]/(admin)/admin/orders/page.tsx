import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types";
import { AdminOrdersClient } from "./orders-client";

export default async function AdminOrdersPage() {
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, users(name, email), order_items(id)")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: deliveryPartners } = await supabase
    .from("users")
    .select("id, name")
    .eq("role", "delivery_partner");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("orders")}
      </h1>

      <AdminOrdersClient
        orders={(orders as any[]) || []}
        deliveryPartners={deliveryPartners || []}
      />
    </div>
  );
}
