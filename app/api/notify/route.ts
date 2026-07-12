import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, email, amount } = body;

    // Operational log — no PII included
    console.log(`[NOTIFY] Order finalized. Manifest ID: ${orderId}`);

    return NextResponse.json({ success: true, logged: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed broadcasting order protocol." }, { status: 500 });
  }
}