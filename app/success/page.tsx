"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutSuccessRedirectPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear dynamic shopping inventory state
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-white text-black selection:bg-emerald-500 selection:text-white font-sans">
      <Navbar />
      
      <div className="pt-40 pb-32 flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mb-8 shadow-inner animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>

        <span className="text-[9px] font-black tracking-[0.3em] text-emerald-600 uppercase block mb-3">
          SECURE SETTLEMENT LOGGED
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase mb-4">
          Session <span className="text-emerald-600 italic font-serif normal-case tracking-normal">Finalized</span>
        </h1>
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 max-w-md mx-auto leading-relaxed mb-12">
          Your Stripe authorization protocol completed successfully. Operational manifest data has been transferred to fulfillment pipelines.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders">
            <Button className="h-12 px-8 rounded-full bg-black text-white font-black uppercase tracking-widest text-[9px] hover:bg-emerald-600 transition-all shadow-md flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5" /> View Orders Ledger
            </Button>
          </Link>
          <Link href="/shop-all">
            <Button variant="outline" className="h-12 px-8 rounded-full border-zinc-200 text-black font-black uppercase tracking-widest text-[9px] hover:bg-zinc-50 transition-all flex items-center gap-2 group">
              Continue Procurement <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}