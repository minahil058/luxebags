import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_12345", {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, email } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Inventory payload empty" }, { status: 400 });
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name || "Procured Bag Manifest",
          images: item.image_url ? [item.image_url.startsWith("http") ? item.image_url : `https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600`] : undefined,
        },
        unit_amount: Math.round((parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://luxebags.vercel.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      customer_email: email || undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout configuration error:", error);
    return NextResponse.json({ error: error.message || "Failed creating checkout redirect" }, { status: 500 });
  }
}