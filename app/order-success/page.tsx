"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, ArrowRight, Loader2, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Force clear manifest on verified settlement landing
    clearCart();

    if (!orderId) {
      router.push("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (isLoading) {
    return (
      <div className="pt-40 pb-24 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-6" />
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Verifying Settlement Vault...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-40 pb-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
         <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900 mb-4">Manifest Not Found</h1>
         <Link href="/">
            <Button className="h-12 px-8 bg-black text-white rounded-xl font-black text-[9px] uppercase tracking-widest">
               Return Home
            </Button>
         </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 px-6 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-lg overflow-hidden">

          {/* Top status bar */}
          <div className="bg-emerald-500 h-1 w-full" />

          <div className="p-8 text-center">
            {/* Icon + Heading */}
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="w-7 h-7 text-emerald-600" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-black text-zinc-900 tracking-tighter uppercase mb-1">
              Settlement <span className="text-emerald-600 italic font-serif normal-case tracking-normal">Verified</span>
            </h1>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.25em] mb-6">
              Your order has been authorized and dispatched.
            </p>

            {/* Info rows */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-xl divide-y divide-zinc-100 text-left mb-6">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Manifest ID</span>
                <span className="text-[10px] font-black text-zinc-900 uppercase">{order.id.split('-')[0].toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Identity</span>
                <span className="text-[10px] font-black text-zinc-700">{order.user_email}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Status</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === 'Paid' ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {order.status || 'Verified'}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Total Authorized</span>
                <span className="text-base font-black text-emerald-600 tracking-tighter">${parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Link href={`/orders/${order.id}`} className="block">
                <Button className="w-full h-11 bg-black text-white rounded-xl font-black text-[9px] uppercase tracking-[0.25em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group">
                  <PackageCheck className="w-3.5 h-3.5" />
                  View in Dashboard
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl border-zinc-200 bg-transparent text-zinc-700 font-black text-[9px] uppercase tracking-[0.25em] hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                >
                  Continue Discovery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfc] text-zinc-900 font-sans selection:bg-emerald-500 selection:text-white antialiased">
      <Navbar />
      <Suspense fallback={
        <div className="pt-40 pb-24 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </main>
  );
}
