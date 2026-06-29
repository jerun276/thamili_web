"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export default function AddProductPage() {
  const t = useTranslations("admin");
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await createProductAction(formData);
      if (result.success) {
        router.push("/admin/products");
        return null;
      }
      return result;
    },
    null
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("addProduct")}
      </h1>

      <Card className="mt-6 max-w-2xl">
        <CardContent className="pt-6">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">{t("productName")}</Label>
              <Input id="name" name="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("description")}</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t("category")}</Label>
              <select
                id="category"
                name="category"
                required
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
              >
                <option value="fresh">Fresh</option>
                <option value="frozen">Frozen</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_germany">{t("priceGermany")} (€)</Label>
                <Input id="price_germany" name="price_germany" type="number" step="0.01" min="0" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_denmark">{t("priceDenmark")} (€)</Label>
                <Input id="price_denmark" name="price_denmark" type="number" step="0.01" min="0" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock_germany">{t("stockGermany")}</Label>
                <Input id="stock_germany" name="stock_germany" type="number" min="0" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_denmark">{t("stockDenmark")}</Label>
                <Input id="stock_denmark" name="stock_denmark" type="number" min="0" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input id="image_url" name="image_url" type="url" placeholder="https://..." />
            </div>

            <div className="flex items-center gap-2">
              <input type="hidden" name="active" value="true" />
              <Label htmlFor="active_toggle">Active</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={pending}>
                {pending ? "Creating..." : t("addProduct")}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
