import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";

export default function BestsellersPage() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <div className="pt-32 pb-12 bg-[#f9fdfa] border-b border-zinc-100">
        <div className="container mx-auto px-6 text-center space-y-4">
          <span className="text-[9px] font-black tracking-[0.3em] text-emerald-600 uppercase block">
            VERIFIED INDUSTRIAL DEMAND
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#1a4d2e] tracking-tight uppercase">
            Bestsellers <span className="text-emerald-600 font-serif italic normal-case tracking-normal">Archive</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 max-w-md mx-auto">
            High-density non-woven structures engineered for supreme lifetime reliability.
          </p>
        </div>
      </div>
      <ProductGrid />
      <Footer />
    </main>
  );
}