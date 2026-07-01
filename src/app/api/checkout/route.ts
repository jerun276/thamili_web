import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, items, totalAmount, locale } = await request.json();

  if (!orderId || !items || !totalAmount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const origin = request.headers.get("origin") || "http://localhost:3000";
  const lang = locale || "en";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: items.map((item: { name: string; quantity: number; price: number }) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    metadata: { order_id: orderId },
    success_url: `${origin}/${lang}/orders/${orderId}?payment=success`,
    cancel_url: `${origin}/${lang}/orders/${orderId}?payment=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
