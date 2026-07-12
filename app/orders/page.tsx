"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronRight, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const parseItems = (itemsStr: any) => {
    if (!itemsStr) return [];
    if (typeof itemsStr === 'string') {
      try { return JSON.parse(itemsStr); } catch (e) { return []; }
    }
    return Array.isArray(itemsStr) ? itemsStr : [];
  };

  useEffect(() => {
    const fetchSessionAndOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user?.email) {
        router.push("/login");
        return;
      }
      
      setUserEmail(session.user.email);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .ilike("user_email", session.user.email)
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
      setIsLoading(false);
    };

    fetchSessionAndOrders();
  }, [router]);

  if (isLoading && !userEmail) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-200" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-zinc-900 font-sans selection:bg-emerald-500 selection:text-white antialiased">
      <Navbar />

      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 space-y-4">
             <nav className="flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
               <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
               <span className="text-zinc-200">/</span>
               <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">Dashboard</Link>
               <span className="text-zinc-200">/</span>
               <span className="text-zinc-900">Order History</span>
             </nav>
             <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tighter uppercase">Procurement <span className="text-emerald-600 italic font-serif normal-case tracking-normal">Manifests</span></h1>
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
               Showing securely retrieved records for: <span className="text-zinc-900 ml-1">{userEmail}</span>
             </p>
          </div>

          {/* Results Manifest */}
          <div className="space-y-6">
             <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="py-20 text-center"
                  >
                    <div className="w-10 h-10 border-2 border-zinc-100 border-t-emerald-600 rounded-full animate-spin mx-auto" />
                  </motion.div>
                ) : orders.length > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 gap-4"
                  >
                    {orders.map((order) => {
                      const orderItems = parseItems(order.items);
                      return (
                        <Link key={order.id} href={`/orders/${order.id}`}>
                          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:border-emerald-500/30 hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4">
                             <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-emerald-600 transition-colors flex-shrink-0 mt-1">
                                   <Package className="w-5 h-5" />
                                </div>
                                <div className="space-y-2">
                                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Manifest ID: {order.id.slice(0, 13)}...</p>
                                   <h4 className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                                      Settlement for ${parseFloat(order.total_amount).toFixed(2)}
                                   </h4>
                                   <div className="flex flex-col gap-1 pt-1">
                                      {orderItems.map((item: any, idx: number) => (
                                         <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                            <span>{item.name} (x{item.quantity})</span>
                                         </div>
                                      ))}
                                   </div>
                                </div>
                             </div>
                           <div className="flex items-center justify-between md:justify-end gap-8 text-right ml-18 md:ml-0">
                              <div className="text-left md:text-right">
                                 <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Authorized On</p>
                                 <p className="text-[11px] font-black text-zinc-900">{new Date(order.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                order.status?.toLowerCase() === "paid" 
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                  : "bg-amber-50 text-amber-600 border-amber-100"
                              }`}>
                                 {order.status || "In Process"}
                              </div>
                              <ChevronRight className="w-5 h-5 text-zinc-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all hidden md:block" />
                           </div>
                        </div>
                      </Link>
                    );
                  })}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="py-24 text-center bg-white rounded-[2rem] border border-zinc-100 shadow-sm"
                  >
                    <div className="w-16 h-16 bg-zinc-50 rounded-full border border-zinc-100 flex items-center justify-center mx-auto mb-6">
                       <ShieldCheck className="w-6 h-6 text-zinc-300" />
                    </div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">No procurement records found for your identity.</p>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
