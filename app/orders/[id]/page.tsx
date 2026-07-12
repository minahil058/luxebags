"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  ArrowLeft, 
  Download, 
  ShieldCheck,
  Calendar,
  ChevronRight,
  Receipt,
  Clock,
  ExternalLink,
  Lock,
  Loader2,
  AlertTriangle,
  CreditCard as CardIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { getSmartSrc } from "@/lib/utils";
import { useStripe, useElements, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeProvider from "@/components/StripeProvider";
import { useCartStore } from "@/store/useCartStore";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function SettlementPortal({ order, total }: { order: any, total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${order.id}`,
        },
        redirect: "if_required",
      });

      if (error) throw error;

      if (paymentIntent.status === "succeeded") {
        const { error: updateError } = await supabase
          .from("orders")
          .update({ status: "Paid" })
          .eq("id", order.id);
          
        if (!updateError) {
          // Reset procurement manifest on successful settlement
          useCartStore.getState().clearCart();
          
          toast.success("SETTLEMENT VERIFIED", {
            description: "Your procurement manifest has been securely promoted to PAID status.",
          });
          router.refresh();
        }
      }

    } catch (err: any) {
      toast.error("SETTLEMENT FAILED: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-xl shadow-emerald-900/5 mb-10"
    >
       <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
             <Lock className="w-5 h-5" />
          </div>
          <div>
             <h2 className="text-base font-black text-zinc-900 uppercase tracking-tight">Settlement Portal</h2>
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Authorized Vault Authorization Required</p>
          </div>
       </div>

       <form onSubmit={handleSettlement} className="space-y-6">
          <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-2xl">
             <PaymentElement />
          </div>

          <Button 
            type="submit"
            disabled={isProcessing || !stripe}
            className="w-full h-16 bg-emerald-600 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-3"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Settlement Protocol"}
          </Button>
          
          <p className="text-[9px] text-center font-bold text-zinc-400 uppercase tracking-widest">
            Secure Settlement of ${total.toFixed(2)} • Powered by Stripe encrypted gateway.
          </p>
       </form>
    </motion.div>
  );
}

function OrderDetailsContent({ order }: { order: any }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [loadingIntent, setLoadingIntent] = useState(false);

  const parseJSON = (val: any) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return val; }
    }
    return val;
  };

  const shipping = parseJSON(order.shipping_address);
  const items = Array.isArray(parseJSON(order.items)) ? parseJSON(order.items) : [];
  const isPaid = order.status?.toLowerCase() === "paid" || order.status?.toLowerCase() === "delivered";
  const totalAmount = parseFloat(order.total_amount) || 0;
  const shippingFee = 20;
  const subtotalAmount = totalAmount - shippingFee;

  useEffect(() => {
    if (!isPaid && totalAmount > 0) {
      setLoadingIntent(true);
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, orderId: order.id, email: shipping.email }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
      })
      .finally(() => setLoadingIntent(false));
    }
  }, [order.id, isPaid, totalAmount, shipping.email]);

  const handleDownloadInvoice = async () => {
    if (typeof window === "undefined") return;
    setIsGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("LUXEBAGS SETTLEMENT INVOICE", 20, 20);
      doc.setFontSize(10);
      doc.text(`Reference: ${order.id}`, 20, 30);
      doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 20, 35);
      doc.text(`Status: ${order.status}`, 20, 40);
      doc.line(20, 45, 190, 45);
      let y = 60;
      items.forEach((item: any) => {
        doc.text(`${item.name} x${item.quantity}`, 20, y);
        doc.text(`$${parseFloat(String(item.price).replace(/[^0-9.]/g, '')).toFixed(2)}`, 160, y);
        y += 10;
      });
      doc.line(20, y + 5, 190, y + 5);
      doc.setFontSize(14);
      doc.text(`Total Settlement: $${totalAmount.toFixed(2)}`, 130, y + 15);
      doc.save(`LuxeBags-Manifest-${order.id.slice(0, 8)}.pdf`);
    } catch (error) {
      toast.error("Invoice generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <div className="space-y-4">
             <nav className="flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
               <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
               <span className="text-zinc-200">/</span>
               <span className="text-zinc-900">Settlement Manifest</span>
             </nav>
             <div className="flex items-center gap-5">
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tighter uppercase">Order <span className="text-emerald-600 italic font-serif normal-case tracking-normal">Summary</span></h1>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                  isPaid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                }`}>
                  {order.status || "In Process"}
                </div>
             </div>
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Manifest ID: {order.id}</p>
          </div>

          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
             <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                <Calendar className="w-5 h-5" strokeWidth={1.5} />
             </div>
             <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Archived On</p>
                <p className="text-xs font-black text-zinc-900 uppercase tracking-tight">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            
            {/* Payment Portal / Threshold Warning */}
            {!isPaid ? (
               clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                     <SettlementPortal order={order} total={totalAmount} />
                  </Elements>
               ) : loadingIntent ? (
                  <div className="p-20 text-center bg-zinc-50 rounded-[2rem] border border-zinc-100 border-dashed animate-pulse">
                     <Loader2 className="w-8 h-8 animate-spin text-zinc-200 mx-auto mb-4" />
                     <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Waking Payment Gateway...</p>
                  </div>
               ) : totalAmount < 150 ? (
                  <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 mb-10 flex flex-col md:flex-row items-center gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                        <AlertTriangle className="w-8 h-8" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-sm font-black text-amber-900 uppercase tracking-tight">Digital Settlement Blocked</h3>
                        <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest leading-relaxed">
                           Order total (${totalAmount.toFixed(2)}) is below the secure digital threshold ($150).
                        </p>
                        <div className="pt-4 flex gap-4">
                           <div className="px-4 py-2 bg-white rounded-lg border border-amber-200 text-[9px] font-black text-amber-600 uppercase tracking-widest">
                              Pay via Bank Transfer
                           </div>
                           <div className="px-4 py-2 bg-white rounded-lg border border-amber-200 text-[9px] font-black text-amber-600 uppercase tracking-widest">
                              Cash on Delivery
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="p-16 text-center bg-red-50 rounded-[2rem] border border-red-100 mb-10">
                     <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
                     <p className="text-[11px] font-black text-red-900 uppercase tracking-widest">Settlement Portal Unavailable</p>
                     <p className="text-[9px] text-red-500/60 font-bold uppercase tracking-widest mt-2">Network timeout or threshold violation. Please refresh or contact logistics support.</p>
                     <Button onClick={() => window.location.reload()} variant="outline" className="mt-6 h-10 px-6 border-red-100 text-red-600 rounded-xl hover:bg-red-100 transition-all">
                        Retry Protocol
                     </Button>
                  </div>
               )
            ) : null}

            <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-zinc-50 bg-zinc-50/30 flex items-center justify-between">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                   <Package className="w-3.5 h-3.5" /> Inventory Manifest
                 </h2>
                 <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase">
                   <Clock className="w-3 h-3" /> Real-time Sync
                 </div>
              </div>
              
              <div className="divide-y divide-zinc-50">
                 {items.map((item: any, idx: number) => (
                   <div key={idx} className="p-8 group hover:bg-zinc-50 transition-all flex items-center gap-6">
                      <div className="relative w-20 h-20 bg-zinc-50 rounded-2xl overflow-hidden p-4 border border-zinc-50 group-hover:border-emerald-500/10 transition-all">
                         <img src={getSmartSrc(item.image_url)} alt={item.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="text-sm font-black text-zinc-900 uppercase tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">{item.name}</h4>
                               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1">Architectural Series • Quantity {item.quantity}</p>
                            </div>
                            <p className="text-sm font-black text-zinc-900 tracking-tighter">${(parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}</p>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="p-10 bg-zinc-50/50 border-t border-zinc-50">
                 <div className="max-w-[280px] ml-auto space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      <span>Manifest Subtotal</span>
                      <span className="text-zinc-900">${subtotalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      <span>Logistics Fee</span>
                      <span className="text-emerald-600 italic">${shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="pt-6 border-t border-zinc-100 flex justify-between items-baseline">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">Final Settlement</span>
                      <span className="text-3xl font-black text-zinc-900 tracking-tighter">${totalAmount.toFixed(2)}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
             <div className="bg-white rounded-2xl p-6 text-zinc-900 shadow-sm border border-zinc-100">
              <div className="space-y-5">
                 <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100">
                       <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-tighter">Logistics <span className="text-zinc-400 italic font-serif normal-case tracking-normal">Identity</span></h3>
                 </div>
                 
                 <div className="divide-y divide-zinc-100">
                    <div className="py-3">
                       <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-1">Identity Name</p>
                       <p className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">{shipping?.name || "Verifying..."}</p>
                    </div>
                    <div className="py-3">
                       <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-1">Physical Coordinates</p>
                       <p className="text-[9px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest">
                          {shipping?.address}, {shipping?.city}, {shipping?.zip}, {shipping?.country}
                       </p>
                    </div>
                 </div>

                 <div className="space-y-2 pt-1">
                    <Button 
                      onClick={handleDownloadInvoice}
                      disabled={isGenerating}
                      className="w-full h-11 rounded-xl bg-zinc-900 text-white font-black text-[9px] uppercase tracking-[0.25em] hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                      {isGenerating ? "Processing..." : "Archive Manifest"}
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Link href="/shop-all" className="w-full block">
                       <Button variant="outline" className="w-full h-11 rounded-xl border-zinc-200 bg-transparent text-zinc-700 font-black text-[9px] uppercase tracking-[0.25em] hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center justify-center gap-2">
                         Continue Discovery
                         <ExternalLink className="w-3 h-3" />
                       </Button>
                    </Link>
                 </div>
              </div>
             </div>

             <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <p className="text-[8px] font-black text-emerald-700 uppercase tracking-widest">
                  Verified via encrypted protocol.
                </p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function OrderDetailsPage({ params }: { params: any }) {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initPage = async () => {
      const resolvedParams = await params;
      const orderId = resolvedParams.id;
      if (!orderId) return;

      const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single();

      if (data) {
        setOrder(data);
        // Sync cart state - if order is already paid, manifest should be empty
        if (data.status === "Paid") {
          useCartStore.getState().clearCart();
        }
      }
      setIsLoading(false);
    };
    initPage();
  }, [params]);

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-zinc-100 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-8">
      <Package className="w-16 h-16 text-zinc-100" />
      <h1 className="text-xl font-black text-zinc-900 uppercase tracking-tighter">Manifest Missing</h1>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-zinc-900 font-sans selection:bg-emerald-500 selection:text-white antialiased">
      <Navbar />
      <OrderDetailsContent order={order} />
      <Footer />
    </main>
  );
}
