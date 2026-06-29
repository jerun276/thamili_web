import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/config";
import type { PickupPoint } from "@/types";

export default async function AdminPickupPointsPage() {
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const { data: pickupPoints } = await supabase
    .from("pickup_points")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("pickupPoints")}
        </h1>
        <Button asChild>
          <Link href="/admin/pickup-points/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addPickupPoint")}
          </Link>
        </Button>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Address</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Country</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">{t("deliveryFee")}</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(pickupPoints as PickupPoint[])?.map((point) => (
                  <tr
                    key={point.id}
                    className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {point.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {point.address}
                    </td>
                    <td className="px-4 py-3 capitalize">{point.country}</td>
                    <td className="px-4 py-3 text-right">€{point.delivery_fee.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={point.active ? "default" : "secondary"}>
                        {point.active ? t("active") : t("inactive")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/pickup-points/${point.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!pickupPoints || pickupPoints.length === 0) && (
              <p className="p-8 text-center text-gray-500">No pickup points found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
