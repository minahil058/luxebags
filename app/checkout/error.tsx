"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CreditCard, RefreshCw, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Checkout Boundary Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-50 selection:text-emerald-900 antialiased">
      <Navbar />
      
      <div className="pt-[150px] pb-20 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
         <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-center justify-center shadow-sm mb-8">
            <CreditCard className="w-10 h-10 text-amber-500" strokeWidth={1.5} />
         </div>
         
         <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4 text-zinc-900">
            SETTLEMENT <span className="text-amber-500 italic font-serif normal-case tracking-normal">INTERRUPTED</span>
         </h1>
         
         <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em] mb-12 max-w-sm leading-relaxed">
           A fault occurred while initializing the secure payment vault. Your items are safe in the manifest.
         </p>

         <div className="flex flex-col sm:flex-row gap-4">
            <Button 
               onClick={() => reset()}
               className="h-14 px-10 rounded-xl bg-black text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-lg flex items-center gap-3 group"
            >
               <RefreshCw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
               Retry Connection
            </Button>
            <Link href="/cart">
               <Button variant="outline" className="h-14 px-10 rounded-xl border-zinc-200 text-zinc-900 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-50 transition-all flex items-center gap-3">
                  <ChevronLeft className="w-4 h-4" />
                  Review Manifest
               </Button>
            </Link>
         </div>
         
         <div className="mt-16 text-[8px] font-black text-zinc-300 uppercase tracking-widest border border-zinc-100 py-3 px-6 rounded-full inline-flex gap-2 bg-zinc-50/50">
            <span>Diagnostic:</span>
            <span className="text-amber-500">{error.message || 'VAULT_FAULT'}</span>
         </div>
      </div>
      
      <Footer />
    </main>
  );
}
