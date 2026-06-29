import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { DeliveriesClient } from "./deliveries-client";

export default async function DeliveriesPage() {
  const t = await getTranslations("delivery");
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: deliveries } = await supabase
    .from("orders")
    .select("*, users(name, phone), order_items(id, quantity)")
    .eq("delivery_partner_id", user?.id)
    .in("status", ["confirmed", "out_for_delivery", "delivered"])
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("deliveries")}
      </h1>

      <DeliveriesClient deliveries={deliveries || []} />
    </div>
  );
}
