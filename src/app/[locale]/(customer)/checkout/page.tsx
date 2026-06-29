"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/config";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, getProductPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PickupPointMap } from "@/components/shared/pickup-point-map";
import type { PickupPoint } from "@/types";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const items = useCartStore((s) => s.items);
  const country = useCartStore((s) => s.country);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const [step, setStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState<"home" | "pickup">("home");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [selectedPickupPointId, setSelectedPickupPointId] = useState<string | null>(null);

  useEffect(() => {
    if (deliveryMethod === "pickup") {
      const supabase = createClient();
      supabase
        .from("pickup_points")
        .select("*")
        .eq("country", country)
        .eq("active", true)
        .then(({ data }) => {
          setPickupPoints((data as PickupPoint[]) || []);
        });
    }
  }, [deliveryMethod, country]);

  const steps = [t("stepAddress"), t("stepDelivery"), t("stepPayment"), t("stepConfirm")];

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-gray-500">Your cart is empty</p>
        <Button asChild className="mt-4">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>

      {/* Step Indicator */}
      <div className="mt-6 flex items-center justify-between">
        {steps.map((label, index) => (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                index <= step
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-700"
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-1 text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("selectAddress")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Select a saved address or add a new one for delivery.
                </p>
                <Button className="mt-4" onClick={() => setStep(1)}>
                  {t("addNewAddress")} / Continue
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("deliveryMethod")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-md border p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
                  <input
                    type="radio"
                    name="delivery"
                    value="home"
                    checked={deliveryMethod === "home"}
                    onChange={() => { setDeliveryMethod("home"); setSelectedPickupPointId(null); }}
                    className="text-green-600"
                  />
                  <div>
                    <p className="font-medium">{t("homeDelivery")}</p>
                    <p className="text-sm text-gray-500">Delivered to your address</p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-md border p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => setDeliveryMethod("pickup")}
                    className="text-green-600"
                  />
                  <div>
                    <p className="font-medium">{t("pickupPoint")}</p>
                    <p className="text-sm text-gray-500">Pick up from a nearby point</p>
                  </div>
                </label>

                {deliveryMethod === "pickup" && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select a pickup point:
                    </p>
                    <PickupPointMap
                      points={pickupPoints}
                      country={country}
                      selectedId={selectedPickupPointId}
                      onSelect={setSelectedPickupPointId}
                      height="280px"
                    />
                    {pickupPoints.length > 0 && (
                      <div className="space-y-2">
                        {pickupPoints.map((point) => (
                          <label
                            key={point.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${
                              selectedPickupPointId === point.id
                                ? "border-green-600 bg-green-50 dark:bg-green-950"
                                : "hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
                            }`}
                          >
                            <input
                              type="radio"
                              name="pickup_point"
                              value={point.id}
                              checked={selectedPickupPointId === point.id}
                              onChange={() => setSelectedPickupPointId(point.id)}
                              className="text-green-600"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{point.name}</p>
                              <p className="text-xs text-gray-500">{point.address}</p>
                            </div>
                            <span className="text-sm font-medium text-green-700">
                              €{point.delivery_fee.toFixed(2)}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                    {pickupPoints.length === 0 && (
                      <p className="text-sm text-gray-500">No pickup points available in your country.</p>
                    )}
                  </div>
                )}

                <Button
                  className="mt-4"
                  onClick={() => setStep(2)}
                  disabled={deliveryMethod === "pickup" && !selectedPickupPointId}
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("paymentMethod")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-md border p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="text-green-600"
                  />
                  <div>
                    <p className="font-medium">{t("payOnline")}</p>
                    <p className="text-sm text-gray-500">Pay with card or Apple/Google Pay</p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-md border p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="text-green-600"
                  />
                  <div>
                    <p className="font-medium">{t("cashOnDelivery")}</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
                <Button className="mt-4" onClick={() => setStep(3)}>
                  Continue
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>{item.product.name} x{item.quantity}</span>
                      <span>€{(getProductPrice(item.product, country) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Delivery: {deliveryMethod === "pickup"
                      ? `Pickup — ${pickupPoints.find((p) => p.id === selectedPickupPointId)?.name || ""}`
                      : "Home Delivery"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment: {paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>€{getSubtotal().toFixed(2)}</span>
                </div>
                <Button className="mt-6 w-full" size="lg">
                  {t("placeOrder")}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="hidden lg:block">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">{t("orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="truncate pr-2">{item.product.name} x{item.quantity}</span>
                    <span className="shrink-0">
                      €{(getProductPrice(item.product, country) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>€{getSubtotal().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
