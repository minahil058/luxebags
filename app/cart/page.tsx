"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCartStore } from "@/store/useCartStore";
import { getSmartSrc } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ChevronLeft, ShieldCheck, Truck, RotateCcw, Info, Tag, Lock, HelpCircle, Sparkles, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 20;
  const total = subtotal + shipping;
  const MIN_ORDER = 150;

  const handleUpdateCart = () => {
    setIsUpdating(true);
    // Simulate industrial sync protocol
    setTimeout(() => {
      setIsUpdating(false);
      toast.success("TRANSACTION MANIFEST SYNCHRONIZED", {
        description: "Your procurement list has been verified and updated.",
        icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />
      });
    }, 800);
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden antialiased">
      <Navbar />

      <div className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          
          {/* Breadcrumbs - Industrial Scale */}
          <nav className="flex items-center gap-2 text-[9px] font-black text-zinc-400 mb-3 uppercase tracking-[0.2em]">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span className="text-zinc-200">/</span>
            <span className="text-zinc-900">Your Shopping Cart</span>
          </nav>

          <div className="mb-12">
            <h1 className="text-2xl md:text-3xl font-black text-center text-zinc-900 uppercase tracking-tight">Your Shopping Cart</h1>
            <div className="w-12 h-1 bg-emerald-500 mx-auto mt-4" />
          </div>

          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center bg-zinc-50 border border-zinc-100 rounded-[2rem]"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 border border-zinc-100 shadow-sm">
                <ShoppingBag className="w-6 h-6 text-zinc-200" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight mb-3">Your cart is empty</h2>
              <p className="text-zinc-400 mb-8 max-w-xs text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Start adding premium industrial carriers to your procurement list.
              </p>
              <Link href="/shop-all">
                <Button className="h-12 px-10 rounded-full bg-[#1a4d2e] text-white font-black hover:bg-black transition-all uppercase tracking-widest text-[9px] shadow-lg">
                  Explore Products
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Product Manifest - Compact Rows */}
              <div className="lg:col-span-8 space-y-10">
                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group flex flex-col md:flex-row items-center gap-8 pb-6 border-b border-zinc-100 last:border-0"
                      >
                        {/* Product Visual - Scaled Down */}
                        <div className="relative w-28 h-28 flex-shrink-0 bg-zinc-50 rounded-[1.5rem] overflow-hidden p-4 border border-zinc-50 group-hover:border-emerald-500/10 transition-all">
                          <Image
                            src={getSmartSrc(item.image_url)}
                            alt={item.name}
                            fill
                            className="object-contain p-1 transition-transform duration-1000 group-hover:scale-110"
                            unoptimized={true}
                          />
                        </div>

                        {/* Details & Controls - Refined Scaling */}
                        <div className="flex-1 space-y-4 w-full">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                            <div className="space-y-1">
                               <h4 className="text-sm font-black text-zinc-900 uppercase tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">
                                 {item.name}
                               </h4>
                               <p className="text-zinc-400 text-[9px] font-black uppercase tracking-widest">
                                 Unit Price: ${parseFloat(String(item.price).replace(/[^0-9.]/g, '')).toFixed(2)}
                               </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                               <p className="text-xl font-black tracking-tighter text-zinc-900">
                                 ${(parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}
                               </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                             <div className="flex items-center bg-white rounded-lg border border-zinc-200 p-0.5 shadow-sm">
                                <button 
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 10))}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-zinc-50 text-zinc-300 hover:text-zinc-900 transition-all rounded"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <input 
                                  type="number" 
                                  value={item.quantity} 
                                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                  className="w-12 bg-transparent text-center font-black text-[11px] focus:outline-none"
                                />
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 10)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-zinc-50 text-zinc-300 hover:text-zinc-900 transition-all rounded"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                             </div>
                             <button 
                               onClick={() => removeItem(item.id)}
                               className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-300 hover:text-red-500 transition-colors flex items-center gap-2"
                             >
                               <Trash2 className="w-3 h-3" /> Remove Item
                             </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Discount Discovery Layer - High Fidelity */}
                <div className="bg-zinc-50/50 rounded-2xl border border-zinc-100 p-8 flex items-center justify-between group overflow-hidden relative transition-all hover:bg-zinc-50">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] -rotate-12">
                     <Sparkles className="w-24 h-24" />
                  </div>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20">
                       <Tag className="w-4 h-4" />
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.3em]">Protocol Discount Activation</p>
                       <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">APPLY YOUR UNIQUE PROCUREMENT IDENTIFIER AT CHECKOUT FOR SETTLEMENT REDUCTION</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-200 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
                </div>
              </div>

              {/* Right Column: Settlement Protocol Summary - Scaled Down Card */}
              <div className="lg:col-span-4 sticky top-32">
                <div className="space-y-6">
                  {/* Main Summary Card - High Density */}
                  <div className="bg-white p-0.5 rounded-lg border border-zinc-900 overflow-hidden shadow-xl shadow-black/5">
                    <div className="p-8 space-y-6">
                       <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            <span>Total {items.length} units</span>
                            <span>Standard Weight</span>
                          </div>
                          <div className="h-px bg-zinc-100" />
                          <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-zinc-900">${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            <span>Shipping</span>
                            <span className="text-zinc-900">
                              {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="h-px bg-zinc-100" />
                          <div className="flex justify-between items-baseline">
                            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900">Total price</span>
                            <span className="text-2xl font-black tracking-tighter text-zinc-900">
                              ${total.toFixed(2)}
                            </span>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <Button 
                            onClick={handleUpdateCart}
                            disabled={isUpdating}
                            variant="outline" 
                            className="w-full h-12 rounded-lg border border-[#1a4d2e] bg-white text-[#1a4d2e] font-black text-[10px] uppercase tracking-widest hover:bg-[#1a4d2e] hover:text-white dark:border-[#1a4d2e] dark:bg-white dark:text-[#1a4d2e] dark:hover:bg-[#1a4d2e] dark:hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            {isUpdating ? (
                               <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                               <RefreshCw className="w-3.5 h-3.5" />
                            )}
                            {isUpdating ? "Syncing..." : "Update Cart"}
                          </Button>
                          <Link href="/checkout" className="w-full block">
                            <Button className="w-full h-14 rounded-lg bg-[#1a4d2e] text-white font-black text-[10px] uppercase tracking-[0.15em] hover:bg-zinc-900 transition-all shadow-lg">
                              Proceed to checkout
                            </Button>
                          </Link>
                          <Link href="/shop-all" className="w-full block">
                            <Button variant="ghost" className="w-full h-10 rounded-lg text-zinc-400 font-black text-[9px] uppercase tracking-widest hover:text-emerald-600 transition-all">
                              <ChevronLeft className="w-3 h-3 mr-2" /> Continue Shopping
                            </Button>
                          </Link>
                       </div>
                    </div>
                  </div>

                  {/* Operational Intelligence Portal - SaaS Style */}
                  <div className="bg-[#f8fafd] rounded-2xl p-8 border border-zinc-100 space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-3 relative z-10">
                       <AlertCircle className="w-4 h-4 text-zinc-300" />
                       <span className="text-[9px] font-black text-zinc-900 uppercase tracking-widest">Processing Intelligence</span>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest relative z-10">
                      NONWOVENBAGS PROCESS ALL SHIPMENTS IN PKR CURRENCY PROTOCOL. LOGISTICS AND TAXES FINALIZED AT VAULT SETTLEMENT.
                    </p>
                  </div>

                  {/* Protocol Links - Compact Hierachy */}
                  <div className="space-y-4 px-2">
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#1a4d2e] group-hover:text-black transition-colors">Security policy</span>
                    </div>
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#1a4d2e] group-hover:text-black transition-colors">Delivery policy</span>
                    </div>
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <RotateCcw className="w-4 h-4 text-emerald-700" />
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#1a4d2e] group-hover:text-black transition-colors">Return policy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
