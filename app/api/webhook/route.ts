import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_12345", {
  apiVersion: "2024-12-18.acacia" as any,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.key",
  { auth: { persistSession: false } }
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  // Enforce webhook secret — reject unsigned requests in all environments
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Webhook configuration error: STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json(
      { error: "Webhook not configured. Set STRIPE_WEBHOOK_SECRET in environment variables." },
      { status: 500 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature validation error:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the settlement lifecycle event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as any;
    // Attempt mapping via metadata if associated
    if (paymentIntent.metadata?.orderId) {
      await supabaseAdmin
        .from("orders")
        .update({ status: "Paid" })
        .eq("id", paymentIntent.metadata.orderId);
    }
  }

  return NextResponse.json({ received: true });
}