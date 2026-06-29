"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { createVanSaleAction } from "@/actions/delivery";
import type { Product } from "@/types";

interface VanSalesClientProps {
  products: Product[];
  userId: string;
  country: string;
}

export function VanSalesClient({ products, userId, country }: VanSalesClientProps) {
  const t = useTranslations("delivery");
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function addToCart(productId: string) {
    const current = cart.get(productId) || 0;
    setCart(new Map(cart.set(productId, current + 1)));
  }

  function removeFromCart(productId: string) {
    const current = cart.get(productId) || 0;
    if (current <= 1) {
      const newCart = new Map(cart);
      newCart.delete(productId);
      setCart(newCart);
    } else {
      setCart(new Map(cart.set(productId, current - 1)));
    }
  }

  function getTotal() {
    let total = 0;
    cart.forEach((qty, productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const price = country === "germany" ? product.price_germany : product.price_denmark;
        total += price * qty;
      }
    });
    return total;
  }

  async function handleSubmit() {
    if (cart.size === 0) return;
    setSubmitting(true);

    const items = Array.from(cart.entries()).map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId)!;
      const price = country === "germany" ? product.price_germany : product.price_denmark;
      return { product_id: productId, quantity, price };
    });

    await createVanSaleAction({
      delivery_partner_id: userId,
      items,
      total_amount: getTotal(),
      country,
    });

    setCart(new Map());
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Product List */}
      <div className="lg:col-span-2">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {t("selectProducts")}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {products.map((product) => {
            const qty = cart.get(product.id) || 0;
            const price = country === "germany" ? product.price_germany : product.price_denmark;
            return (
              <Card key={product.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500">€{price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => removeFromCart(product.id)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{qty}</span>
                      </>
                    )}
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => addToCart(product.id)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Cart Summary */}
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingBag className="h-5 w-5" />
              {t("quickCheckout")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.size === 0 ? (
              <p className="text-sm text-gray-500">No items selected</p>
            ) : (
              <div className="space-y-2">
                {Array.from(cart.entries()).map(([productId, qty]) => {
                  const product = products.find((p) => p.id === productId)!;
                  const price = country === "germany" ? product.price_germany : product.price_denmark;
                  return (
                    <div key={productId} className="flex justify-between text-sm">
                      <span>{product.name} x{qty}</span>
                      <span>€{(price * qty).toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>€{getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="mt-3 rounded-md bg-green-50 p-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
                Van sale created successfully!
              </div>
            )}

            <Button
              className="mt-4 w-full"
              onClick={handleSubmit}
              disabled={cart.size === 0 || submitting}
            >
              {submitting ? "Processing..." : t("createVanSale")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
