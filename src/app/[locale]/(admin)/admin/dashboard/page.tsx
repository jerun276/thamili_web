import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, Clock } from "lucide-react";

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  const [ordersResult, todayOrdersResult, customersResult, pendingResult] =
    await Promise.all([
      supabase.from("orders").select("total_amount"),
      supabase
        .from("orders")
        .select("id")
        .gte("created_at", `${today}T00:00:00`),
      supabase
        .from("users")
        .select("id")
        .eq("role", "customer"),
      supabase
        .from("orders")
        .select("id")
        .eq("status", "pending"),
    ]);

  const totalRevenue =
    ordersResult.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
  const ordersToday = todayOrdersResult.data?.length || 0;
  const activeCustomers = customersResult.data?.length || 0;
  const pendingOrders = pendingResult.data?.length || 0;

  const stats = [
    {
      title: t("totalRevenue"),
      value: `€${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600 bg-green-100 dark:bg-green-900",
    },
    {
      title: t("ordersToday"),
      value: ordersToday.toString(),
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900",
    },
    {
      title: t("activeCustomers"),
      value: activeCustomers.toString(),
      icon: Users,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900",
    },
    {
      title: t("pendingOrders"),
      value: pendingOrders.toString(),
      icon: Clock,
      color: "text-orange-600 bg-orange-100 dark:bg-orange-900",
    },
  ];

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, status, total_amount, created_at, user_id, users(name)")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("dashboard")}
      </h1>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Recent Orders */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("recentOrders")}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Order ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-3">
                        {order.users?.name || "Unknown"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize dark:bg-gray-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        €{order.total_amount?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
