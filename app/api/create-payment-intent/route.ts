import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_12345", {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(req: Request) {
  try {
    const { amount, email } = await req.json();

    if (!amount || amount < 150) {
      return NextResponse.json(
        { error: "Minimum procurement protocol requires $150 threshold." },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      // Return simulated client secret in test mode if stripe keys are absent
      return NextResponse.json({
        clientSecret: "pi_simulated_secret_test_key_12345",
      });
    }

    // Convert dollar amount to cents for Stripe ledger
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      receipt_email: email || undefined,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe Vault creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to establish vault protocol" },
      { status: 500 }
    );
  }
}