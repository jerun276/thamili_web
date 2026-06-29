"use client";

import Image from "next/image";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, getProductPrice, getProductStock } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/storefront/product-card";
import { useState } from "react";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const t = useTranslations("products");
  const country = useCartStore((s) => s.country);
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  const price = getProductPrice(product, country);
  const stock = getProductStock(product, country);
  const stockStatus = stock === 0 ? "out" : stock <= 5 ? "low" : "in";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-8xl">🐟</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>
              <p className="mt-1 text-sm capitalize text-gray-500 dark:text-gray-400">
                {product.category}
              </p>
            </div>
            <Badge
              variant={stockStatus === "out" ? "destructive" : stockStatus === "low" ? "warning" : "default"}
            >
              {stockStatus === "out" ? t("outOfStock") : stockStatus === "low" ? t("lowStock") : t("inStock")}
            </Badge>
          </div>

          {product.description && (
            <p className="mt-6 text-gray-600 dark:text-gray-300">{product.description}</p>
          )}

          <div className="mt-8">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(price, country)}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                disabled={quantity >= stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              size="lg"
              onClick={() => addItem(product, quantity)}
              disabled={stock === 0}
              className="flex-1"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {t("addToCart")}
            </Button>
          </div>

          {/* Stock info */}
          {stock > 0 && stock <= 10 && (
            <p className="mt-4 text-sm text-orange-600 dark:text-orange-400">
              Only {stock} left in stock
            </p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("relatedProducts")}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
