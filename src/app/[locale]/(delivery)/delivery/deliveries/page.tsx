import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { DeliveriesClient } from "./deliveries-client";

export default async function DeliveriesPage() {
  const t = await getTranslations("delivery");
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: schedules } = await supabase
    .from("delivery_schedule")
    .select("*, orders(*, users(name, phone), order_items(id, quantity, products(name)))")
    .eq("delivery_partner_id", user?.id)
    .order("created_at", { ascending: false });

  const deliveries = (schedules || [])
    .filter((s: any) => s.orders)
    .map((s: any) => ({
      ...s.orders,
      schedule_id: s.id,
      schedule_status: s.status,
      delivery_date: s.delivery_date,
    }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("deliveries")}
      </h1>

      <DeliveriesClient deliveries={deliveries} />
    </div>
  );
}
