"use client";

import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatPrice, getProductPrice } from "@/lib/utils";
import { Link } from "@/i18n/config";
import Image from "next/image";

export default function CartPage() {
  const t = useTranslations("cart");
  const items = useCartStore((s) => s.items);
  const country = useCartStore((s) => s.country);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-600" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          {t("empty")}
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{t("emptySubtitle")}</p>
        <Button asChild className="mt-6">
          <Link href="/products">{t("continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const price = getProductPrice(item.product, country);
              return (
                <Card key={item.product.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl">🐟</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{formatPrice(price, country)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(price * item.quantity, country)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("subtotal")}
              </h3>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {t("itemCount", { count: items.length })}
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(getSubtotal(), country)}
                </span>
              </div>
              <Button asChild className="mt-6 w-full" size="lg">
                <Link href="/checkout">{t("checkout")}</Link>
              </Button>
              <Button variant="ghost" asChild className="mt-2 w-full">
                <Link href="/products">{t("continueShopping")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
