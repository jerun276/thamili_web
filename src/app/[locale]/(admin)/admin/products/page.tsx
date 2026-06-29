import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/config";
import type { Product } from "@/types";

export default async function AdminProductsPage() {
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("products")}
        </h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addProduct")}
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
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">{t("priceGermany")}</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">{t("priceDenmark")}</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">{t("stockGermany")}</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">{t("stockDenmark")}</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product: Product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-right">€{product.price_germany.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">€{product.price_denmark.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">{product.stock_germany}</td>
                    <td className="px-4 py-3 text-right">{product.stock_denmark}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={product.active ? "default" : "secondary"}>
                        {product.active ? t("active") : t("inactive")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          {t("editProduct")}
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!products || products.length === 0) && (
              <p className="p-8 text-center text-gray-500">No products found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
