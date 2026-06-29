import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/config";
import type { PickupPoint } from "@/types";
import { PickupPointsClient } from "./pickup-points-client";

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

      <PickupPointsClient pickupPoints={(pickupPoints as PickupPoint[]) || []} />
    </div>
  );
}
