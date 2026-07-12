import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize an elevated Supabase admin client to securely manage inventory synchronization ledger
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.key",
  {
    auth: { persistSession: false },
  }
);

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing required identifier." }, { status: 400 });
    }

    // 1. Retrieve the manifest record
    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Manifest not found." }, { status: 404 });
    }

    // If already processed, return success to prevent double counting
    if (order.status === "Paid") {
      return NextResponse.json({ success: true, message: "Ledger already verified." });
    }

    // 2. Parse items and synchronize product stock quantities
    let items = [];
    try {
      items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
    } catch (e) {
      console.error("Failed parsing items json array:", e);
    }

    if (Array.isArray(items)) {
      for (const item of items) {
        if (!item.id || item.id.startsWith("sim-")) continue;

        // Retrieve current inventory state
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("stock_quantity")
          .eq("id", item.id)
          .single();

        if (product && typeof product.stock_quantity === "number") {
          const newQty = Math.max(0, product.stock_quantity - (item.quantity || 1));
          // Perform definitive decrement
          await supabaseAdmin
            .from("products")
            .update({ stock_quantity: newQty })
            .eq("id", item.id);
        }
      }
    }

    // 3. Mark manifest status securely as Paid
    await supabaseAdmin
      .from("orders")
      .update({ status: "Paid" })
      .eq("id", orderId);

    return NextResponse.json({ success: true, synchronized: true });
  } catch (error: any) {
    console.error("Order verification processing error:", error);
    return NextResponse.json({ error: error.message || "Internal failure" }, { status: 500 });
  }
}