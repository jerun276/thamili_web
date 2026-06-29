import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { VanSalesClient } from "./van-sales-client";
import type { Product } from "@/types";

export default async function VanSalesPage() {
  const t = await getTranslations("delivery");
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("users")
    .select("country_preference")
    .eq("id", user?.id)
    .single();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("vanSales")}
      </h1>

      <VanSalesClient
        products={(products as Product[]) || []}
        userId={user?.id || ""}
        country={userData?.country_preference || "germany"}
      />
    </div>
  );
}
