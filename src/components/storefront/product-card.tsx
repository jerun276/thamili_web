"use client";

import Image from "next/image";
import { Product, Country } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, getProductPrice, getProductStock } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/config";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("products");
  const country = useCartStore((s) => s.country);
  const addItem = useCartStore((s) => s.addItem);

  const price = getProductPrice(product, country);
  const stock = getProductStock(product, country);

  const stockStatus = stock === 0 ? "out" : stock <= 5 ? "low" : "in";

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl text-gray-300">🐟</span>
            </div>
          )}
          <Badge
            variant={stockStatus === "out" ? "destructive" : stockStatus === "low" ? "warning" : "default"}
            className="absolute right-2 top-2"
          >
            {stockStatus === "out" ? t("outOfStock") : stockStatus === "low" ? t("lowStock") : t("inStock")}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 group-hover:text-green-600 dark:text-white">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">
          {product.category}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(price, country)}
          </span>
          <Button
            size="sm"
            onClick={() => addItem(product)}
            disabled={stock === 0}
            aria-label={t("addToCart")}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
