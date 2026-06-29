import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cancelOrderAction } from "@/actions/orders";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_STEPS = ["pending", "confirmed", "out_for_delivery", "delivered"];

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const t = await getTranslations("orders");
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, image_url)), pickup_points(name, address)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Order #{order.id.slice(0, 8)}
        </h1>
        <Badge variant={order.status === "canceled" ? "destructive" : "default"}>
          {order.status.replace(/_/g, " ")}
        </Badge>
      </div>

      {/* Status Timeline */}
      {order.status !== "canceled" && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, index) => (
              <div key={step} className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    index <= currentStepIndex
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-500 dark:bg-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="mt-1 text-xs capitalize text-gray-500">
                  {step.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2 mx-4">
            <div className="absolute left-0 top-0 h-1 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div
              className="absolute left-0 top-0 h-1 rounded bg-green-600 transition-all"
              style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Order Items */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">{t("items")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.products?.name || "Product"}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">€{item.subtotal?.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t pt-4 dark:border-gray-800">
            <span className="font-bold">{t("total")}</span>
            <span className="font-bold">€{order.total_amount?.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Info */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">{t("deliveryInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Delivery Method</dt>
              <dd className="capitalize">{order.delivery_method}</dd>
            </div>
            {order.delivery_address && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Address</dt>
                <dd>{order.delivery_address}</dd>
              </div>
            )}
            {order.pickup_points && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Pickup Point</dt>
                <dd>{order.pickup_points.name}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">{t("paymentStatus")}</dt>
              <dd className="capitalize">{order.payment_status}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Cancel Button */}
      {order.status === "pending" && (
        <form action={async () => { "use server"; await cancelOrderAction(order.id); }} className="mt-4">
          <Button type="submit" variant="destructive">
            {t("cancelOrder")}
          </Button>
        </form>
      )}
    </div>
  );
}
