import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/config";
import type { Order } from "@/types";

const STATUS_VARIANT: Record<string, "default" | "warning" | "destructive" | "secondary"> = {
  pending: "warning",
  confirmed: "default",
  out_for_delivery: "secondary",
  delivered: "default",
  canceled: "destructive",
};

export default async function CustomerOrdersPage() {
  const t = await getTranslations("orders");
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(id)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>

      {orders && orders.length > 0 ? (
        <div className="mt-6 space-y-4">
          {orders.map((order: any) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-mono text-sm text-gray-500">
                      #{order.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()} &middot;{" "}
                      {order.order_items?.length || 0} {t("items")}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={STATUS_VARIANT[order.status] || "secondary"}>
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      €{order.total_amount?.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-white">{t("noOrders")}</p>
          <p className="mt-1 text-gray-500">{t("noOrdersSubtitle")}</p>
          <Button asChild className="mt-4">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
