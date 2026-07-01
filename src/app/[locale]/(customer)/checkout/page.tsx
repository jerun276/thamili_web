"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/config";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, getProductPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { PickupPointMap } from "@/components/shared/pickup-point-map";
import { createOrderAction } from "@/actions/orders";
import { Loader2, Plus } from "lucide-react";
import type { PickupPoint } from "@/types";

interface SavedAddress {
  id: string;
  name: string | null;
  type: string | null;
  street: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  instructions: string | null;
  is_default: boolean | null;
}

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const country = useCartStore((s) => s.country);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const [step, setStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState<"home" | "pickup">("home");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [selectedPickupPointId, setSelectedPickupPointId] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orderSubmittedRef = useRef(false);

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
    instructions: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false })
          .then(({ data }) => {
            const addrs = (data as SavedAddress[]) || [];
            setSavedAddresses(addrs);
            const defaultAddr = addrs.find((a) => a.is_default);
            if (defaultAddr) setSelectedAddressId(defaultAddr.id);
            if (addrs.length === 0) setShowNewAddress(true);
          });
      }
    });
  }, []);

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

  function getDeliveryAddress(): string {
    if (selectedAddressId && !showNewAddress) {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      if (addr) return `${addr.street}, ${addr.postal_code} ${addr.city}`;
    }
    return `${newAddress.street}, ${newAddress.postalCode} ${newAddress.city}`;
  }

  function getDeliveryFee(): number {
    if (deliveryMethod === "pickup" && selectedPickupPointId) {
      const point = pickupPoints.find((p) => p.id === selectedPickupPointId);
      return point?.delivery_fee || 0;
    }
    return 0;
  }

  function getOrderTotal(): number {
    return getSubtotal() + getDeliveryFee();
  }

  function canContinueAddress(): boolean {
    if (showNewAddress) {
      return !!(newAddress.street && newAddress.city && newAddress.postalCode);
    }
    return !!selectedAddressId;
  }

  async function handleContinueFromAddress() {
    if (showNewAddress && saveNewAddress && newAddress.street) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("addresses").insert({
          user_id: user.id,
          name: newAddress.name || "Home",
          type: "home",
          street: newAddress.street,
          city: newAddress.city,
          postal_code: newAddress.postalCode,
          country,
          phone: newAddress.phone || null,
          instructions: newAddress.instructions || null,
          is_default: savedAddresses.length === 0,
        });
      }
    }
    setStep(1);
  }

  async function handlePlaceOrder() {
    if (orderSubmittedRef.current) return;
    orderSubmittedRef.current = true;
    setPlacing(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to place an order.");
      setPlacing(false);
      orderSubmittedRef.current = false;
      return;
    }

    const result = await createOrderAction({
      user_id: user.id,
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: getProductPrice(item.product, country),
      })),
      total_amount: getOrderTotal(),
      country,
      payment_method: paymentMethod,
      delivery_method: deliveryMethod,
      delivery_address: deliveryMethod === "home" ? getDeliveryAddress() : undefined,
      pickup_point_id: deliveryMethod === "pickup" ? selectedPickupPointId! : undefined,
    });

    if (result.error) {
      setError(result.error);
      setPlacing(false);
      orderSubmittedRef.current = false;
      return;
    }

    if (paymentMethod === "online") {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: result.orderId,
          totalAmount: getOrderTotal(),
          locale,
          items: items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: getProductPrice(item.product, country),
          })),
        }),
      });

      const data = await res.json();

      if (data.url) {
        clearCart();
        window.location.href = data.url;
        return;
      } else {
        setError(data.error || "Failed to create payment session.");
        setPlacing(false);
        orderSubmittedRef.current = false;
        return;
      }
    }

    clearCart();
    router.push(`/orders/${result.orderId}`);
  }

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
              <CardContent className="space-y-4">
                {/* Saved addresses */}
                {savedAddresses.length > 0 && !showNewAddress && (
                  <div className="space-y-2">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 transition-colors ${
                          selectedAddressId === addr.id
                            ? "border-green-600 bg-green-50 dark:bg-green-950"
                            : "hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="text-green-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {addr.name || addr.type || "Address"}
                            {addr.is_default && (
                              <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
                                Default
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {addr.street}, {addr.postal_code} {addr.city}
                          </p>
                          {addr.phone && (
                            <p className="text-xs text-gray-400">{addr.phone}</p>
                          )}
                        </div>
                      </label>
                    ))}
                    <button
                      onClick={() => { setShowNewAddress(true); setSelectedAddressId(null); }}
                      className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 p-3 text-sm text-gray-600 hover:border-green-500 hover:text-green-600 dark:border-gray-600 dark:text-gray-400"
                    >
                      <Plus className="h-4 w-4" />
                      Add new address
                    </button>
                  </div>
                )}

                {/* New address form */}
                {showNewAddress && (
                  <div className="space-y-4">
                    {savedAddresses.length > 0 && (
                      <button
                        onClick={() => {
                          setShowNewAddress(false);
                          const def = savedAddresses.find((a) => a.is_default);
                          setSelectedAddressId(def?.id || savedAddresses[0].id);
                        }}
                        className="text-sm text-green-600 hover:underline"
                      >
                        ← Use saved address
                      </button>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="addrName">Label (optional)</Label>
                      <Input
                        id="addrName"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        placeholder="e.g. Home, Work"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="e.g. Musterstraße 12"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          placeholder="e.g. 10115"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="e.g. Berlin"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="e.g. +49 123 456789"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Delivery Instructions (optional)</Label>
                      <Input
                        id="instructions"
                        value={newAddress.instructions}
                        onChange={(e) => setNewAddress({ ...newAddress, instructions: e.target.value })}
                        placeholder="e.g. Ring bell twice"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <input
                        type="checkbox"
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className="text-green-600"
                      />
                      Save this address for future orders
                    </label>
                  </div>
                )}

                <Button
                  className="mt-2"
                  onClick={handleContinueFromAddress}
                  disabled={!canContinueAddress()}
                >
                  Continue
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
                <Button variant="outline" className="mt-4 ml-2" onClick={() => setStep(0)}>
                  Back
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
                <Button variant="outline" className="mt-4 ml-2" onClick={() => setStep(1)}>
                  Back
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
                  {deliveryMethod === "home" && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address: {getDeliveryAddress()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Payment: {paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>€{getSubtotal().toFixed(2)}</span>
                  </div>
                  {getDeliveryFee() > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>€{getDeliveryFee().toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>€{getOrderTotal().toFixed(2)}</span>
                </div>

                {error && (
                  <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                    {error}
                  </div>
                )}

                <Button
                  className="mt-6 w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {placing ? "Placing order..." : t("placeOrder")}
                </Button>
                <Button variant="outline" className="mt-2 w-full" onClick={() => setStep(2)} disabled={placing}>
                  Back
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
              {getDeliveryFee() > 0 && (
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Delivery Fee</span>
                  <span>€{getDeliveryFee().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>€{getOrderTotal().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
