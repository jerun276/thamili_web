"use client";

import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { useState } from "react";

interface PayNowButtonProps {
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
}

export function PayNowButton({ orderId, items, totalAmount }: PayNowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, items, totalAmount }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create payment session.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={handlePay} disabled={loading} className="gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        {loading ? "Redirecting to payment..." : "Pay Now"}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
