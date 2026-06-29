import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Package, CheckCircle } from "lucide-react";

export default async function DeliveryDashboardPage() {
  const t = await getTranslations("delivery");
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];

  const [assignedResult, inTransitResult, deliveredResult] = await Promise.all([
    supabase
      .from("orders")
      .select("id")
      .eq("delivery_partner_id", user?.id)
      .eq("status", "confirmed")
      .gte("created_at", `${today}T00:00:00`),
    supabase
      .from("orders")
      .select("id")
      .eq("delivery_partner_id", user?.id)
      .eq("status", "out_for_delivery"),
    supabase
      .from("orders")
      .select("id")
      .eq("delivery_partner_id", user?.id)
      .eq("status", "delivered")
      .gte("created_at", `${today}T00:00:00`),
  ]);

  const stats = [
    {
      title: t("assigned"),
      value: assignedResult.data?.length || 0,
      icon: Package,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900",
    },
    {
      title: t("inTransit"),
      value: inTransitResult.data?.length || 0,
      icon: Truck,
      color: "text-orange-600 bg-orange-100 dark:bg-orange-900",
    },
    {
      title: t("delivered"),
      value: deliveredResult.data?.length || 0,
      icon: CheckCircle,
      color: "text-green-600 bg-green-100 dark:bg-green-900",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("dashboard")}
      </h1>

      <h2 className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">
        {t("todaySummary")}
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
