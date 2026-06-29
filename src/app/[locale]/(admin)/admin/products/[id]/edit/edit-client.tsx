"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { ProductForm } from "@/components/admin/product-form";
import { updateProductAction } from "@/actions/products";

interface EditProductClientProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    price_germany: number;
    price_denmark: number;
    stock_germany: number;
    stock_denmark: number;
    active: boolean;
    image_url: string | null;
    sell_type: string | null;
    unit: string | null;
    pack_size_grams: number | null;
  };
}

export function EditProductClient({ product }: EditProductClientProps) {
  const t = useTranslations("admin");

  async function handleSubmit(formData: FormData) {
    return await updateProductAction(product.id, formData);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Edit Product
      </h1>

      <Card className="mt-6 max-w-2xl">
        <CardContent className="pt-6">
          <ProductForm mode="edit" product={product} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
