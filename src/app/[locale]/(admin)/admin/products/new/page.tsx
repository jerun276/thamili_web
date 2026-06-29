"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "@/actions/products";

export default function AddProductPage() {
  const t = useTranslations("admin");

  async function handleSubmit(formData: FormData) {
    return await createProductAction(formData);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        {t("addProduct")}
      </h1>

      <Card className="mt-6 max-w-2xl">
        <CardContent className="pt-6">
          <ProductForm mode="create" onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
