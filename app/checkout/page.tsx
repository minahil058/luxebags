"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Package,
  MapPin,
  User,
  Mail,
  Smartphone,
  Globe,
  Building,
  CreditCard as CardIcon,
  ShoppingBag,
  ExternalLink,
  Wallet,
  Globe as PaypalIcon,
  CircleDollarSign,
  HelpCircle,
  Search,
  ChevronDown,
  Loader2,
  Plus,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Receipt,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getSmartSrc } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { useStripe, useElements, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function StripePaymentSection({ clientSecret, total, onFinalize }: { clientSecret: string, total: number, onFinalize: (stripe: any, elements: any) => Promise<void> }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    try {
      await onFinalize(stripe, elements);
    } catch (err) {
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="p-6 bg-white rounded-2xl min-h-[200px] shadow-sm">
          <PaymentElement options={{ 
            layout: {
              type: 'accordion',
              defaultCollapsed: false,
              radios: 'always',
              spacedAccordionItems: false
            }
          }} />
       </div>
       <Button 
         type="button"
         onClick={(e) => handlePay(e)}
         disabled={isProcessing || !stripe || total < 150}
         className="w-full h-12 bg-black text-white rounded-xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
       >
         {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
           <>
             <ShieldCheck className="w-5 h-5" />
             Pay now
           </>
         )}
       </Button>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [initError, setInitError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "shoppay">("card");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    phone: ""
  });

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);

  const subtotal = isMounted ? getCartTotal() : 0;
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0;
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 20; 
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyDiscount = () => {
    if (!discountCode) return;
    const cleanCode = discountCode.trim().toUpperCase();
    
    // Configured coupon codes
    if (cleanCode === "LUXE10" || cleanCode === "LUXEBAGS10") {
      setAppliedDiscount({ code: cleanCode, percent: 10 });
      toast.success("DISCOUNT PROTOCOL ACTIVATED", {
        description: "10% reduction applied to settlement.",
        icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />
      });
      setDiscountCode("");
    } else if (cleanCode === "INDUSTRIAL20") {
      setAppliedDiscount({ code: cleanCode, percent: 20 });
      toast.success("DISCOUNT PROTOCOL ACTIVATED", {
        description: "20% reduction applied to settlement.",
        icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />
      });
      setDiscountCode("");
    } else if (cleanCode === "WELCOME15") {
      setAppliedDiscount({ code: cleanCode, percent: 15 });
      toast.success("DISCOUNT PROTOCOL ACTIVATED", {
        description: "15% reduction applied to settlement.",
        icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />
      });
      setDiscountCode("");
    } else {
      toast.error("INVALID PROTOCOL IDENTIFIER", {
        description: "The entered code is not recognized."
      });
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    toast.info("DISCOUNT DEACTIVATED", {
      description: "Coupon code has been removed."
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const initVault = async () => {
    
    if (total < 150) {
       setInitError("Minimum order amount for checkout is $150");
       setIsInitializing(false);
       setClientSecret("");
       return;
    }
    
    setIsInitializing(true);
    setInitError(null);
    setClientSecret("");
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, email }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Vault connection failed");
      }

      const data = await res.json();
      
      if (data.error) {
         setInitError(data.error);
         toast.error("VAULT ERROR", { description: data.error });
      } else if (data.clientSecret) {
         setClientSecret(data.clientSecret);
      } else {
        throw new Error("Invalid response from secure vault");
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
         setInitError("Network timeout. Vault connection could not be established.");
         toast.error("TIMEOUT ERROR", { description: "Vault connection took too long." });
      } else {
         console.error("Vault initialization failed:", err);
         setInitError(err.message || "Could not establish secure link. Please try again.");
         toast.error("VAULT LINK FAILED");
      }
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    
    const getUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    };
    getUserSession();

    if (items.length > 0) {
      initVault();
    }
  }, [items.length, total]);

  const handleFinalize = async (stripe?: any, elements?: any) => {
    if (!email) {
      toast.error("Please provide a contact email.");
      return;
    }

    try {
      // 1. Create Order in Supabase first (Pending status)
      const manifestData = {
        user_email: email,
        items: JSON.stringify(items),
        total_amount: total,
        shipping_address: JSON.stringify({ ...formData, email }),
        payment_method: paymentMethod,
        status: "Pending"
      };

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(manifestData)
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Handle Payment Method Specific Logic
      if (paymentMethod === "card" && stripe && elements) {
        toast.info("Processing secure settlement...");
        
        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/order-success?orderId=${order.id}`,
          },
          redirect: "if_required",
        });

        if (confirmError) {
          toast.error("Payment failed: " + confirmError.message);
          router.push(`/orders/${order.id}`); 
          return;
        }

        if (paymentIntent && paymentIntent.status === "succeeded") {
           // Call the secure backend route to verify, decrement inventory, and notify admin
           await fetch("/api/order/verify", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ orderId: order.id }),
           });
           
           toast.success("PAYMENT VERIFIED & INVENTORY SYNCED");
        }
      } else {
        toast.success("ORDER CREATED: Awaiting Settlement");
      }

      clearCart();
      router.push(`/order-success?orderId=${order.id}`);

    } catch (err: any) {
      console.error("FINALIZE ERROR:", err);
      toast.error("TRANSACTION FAILED: " + err.message);
    }
  };

  if (isMounted && items.length === 0 && !isInitializing) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-[120px] min-h-[70vh] flex flex-col items-center justify-center p-8">
           <div className="w-24 h-24 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 flex items-center justify-center shadow-sm mb-8">
              <Package className="w-10 h-10 text-emerald-600" />
           </div>
           <h2 className="text-2xl font-black tracking-tighter uppercase mb-4 text-zinc-900">MANIFEST IS <span className="text-emerald-500 italic font-serif normal-case tracking-normal">EMPTY</span></h2>
           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em] mb-12 max-w-xs text-center leading-relaxed">
             No procurement units identified for settlement.
           </p>
           <Link href="/shop-all">
              <Button className="h-16 px-12 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-xl flex items-center gap-4">
                 START DISCOVERY
                 <ArrowRight className="w-4 h-4" />
              </Button>
           </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 selection:bg-emerald-50 selection:text-emerald-900 antialiased font-sans">
      <Navbar />
      
      <div className="pt-[80px] lg:pt-[100px]">
        <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:grid lg:grid-cols-[1fr_480px] min-h-screen border-t border-zinc-100">
          
          {/* Left Column: Form Flow */}
          <div className="p-6 lg:p-12 lg:pr-16 bg-white border-r border-zinc-100">
             <div className="max-w-[580px] ml-auto space-y-12">
               
               {/* Back & Continue Navigation */}
               <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                  <Link href="/cart" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-[#1a4d2e] transition-colors flex items-center gap-2">
                     <ArrowLeft className="w-3.5 h-3.5" /> Return to Cart
                  </Link>
                  <Link href="/shop-all" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-[#1a4d2e] transition-colors flex items-center gap-2">
                     Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
               </div>

               {/* Contact Strategy */}
               <section className="space-y-6">
                  <div className="flex justify-between items-baseline">
                     <h2 className="text-xl font-black tracking-tight text-zinc-900 uppercase">Contact</h2>
                     <button className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-black">Login</button>
                  </div>
                  <div className="space-y-4">
                     <div className="relative group">
                        <Input 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="h-14 rounded-xl border-zinc-200 bg-zinc-50/50 px-5 pt-4 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                          placeholder="Email or Mobile Link"
                        />
                        <label className="absolute left-5 top-1.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-emerald-600">Account Identifier</label>
                     </div>
                     <div className="flex items-center gap-3 px-1">
                        <Checkbox id="news" className="w-4 h-4 rounded border-zinc-300 text-emerald-600" />
                        <label htmlFor="news" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-zinc-900 transition-colors">Email me with news and offers</label>
                     </div>
                  </div>
               </section>

               {/* Logistics Identity */}
               <section className="space-y-6">
                  <h2 className="text-xl font-black tracking-tight text-zinc-900 uppercase">Logistics</h2>
                  <div className="space-y-3">
                     <div className="relative">
                        <select className="w-full h-14 px-5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm appearance-none outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all pt-4">
                           <option>United States</option>
                           <option>Pakistan</option>
                           <option>United Kingdom</option>
                        </select>
                        <label className="absolute left-5 top-1.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Country/Region</label>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                        <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name (Optional)" className="h-14 rounded-xl border-zinc-200 bg-zinc-50/50 px-5 focus:bg-white" />
                        <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="h-14 rounded-xl border-zinc-200 bg-zinc-50/50 px-5 focus:bg-white" />
                     </div>

                     <div className="relative">
                        <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="Address" className="h-14 rounded-xl border-zinc-200 bg-zinc-50/50 px-5 pr-12 focus:bg-white" />
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                     </div>

                     <Input placeholder="Apartment, suite, etc. (Optional)" className="h-14 rounded-xl border-zinc-200 bg-zinc-50/50 px-5 focus:bg-white" />

                     <div className="grid grid-cols-3 gap-3">
                        <Input id="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="h-14 rounded-xl border-zinc-200 bg-zinc-50/50 px-5 focus:bg-white" />
                        <div className="relative">
                           <select className="w-full h-14 px-5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm appearance-none outline-none focus:bg-white pt-4">
                              <option>State</option>
                              <option>Punjab</option>
                              <option>Sindh</option>
                           </select>
                           <label className="absolute left-5 top-1.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">State</label>
                           <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                        </div>
                        <Input id="zip" value={formData.zip} onChange={handleInputChange} placeholder="ZIP code" className="h-14 rounded-xl border-zinc-200 bg-zinc-50/50 px-5 focus:bg-white" />
                     </div>
                  </div>
               </section>

               {/* Payment Strategy */}
               <section className="space-y-6 pt-4 border-t border-zinc-100">
                  <div className="space-y-1">
                     <h2 className="text-xl font-black tracking-tight text-zinc-900 uppercase">Payment</h2>
                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">All transactions are secure and encrypted.</p>
                  </div>

                  <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-500">
                      <div className="p-6 bg-zinc-50/30 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                          {initError ? (
                             <div className="space-y-4">
                               <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
                                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                  <span>{initError}</span>
                               </div>
                               <Link href="/shop-all" className="block">
                                  <Button className="w-full h-12 bg-[#1a4d2e] hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg">
                                     Continue Shopping <ArrowRight className="w-4 h-4" />
                                  </Button>
                               </Link>
                             </div>
                          ) : isInitializing ? (
                            <div className="py-12 flex flex-col items-center gap-4">
                               <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">Establishing Secure Link...</p>
                            </div>
                          ) : clientSecret ? (
                            <div className="bg-white p-6 border border-zinc-100 rounded-2xl shadow-sm">
                              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#000000', borderRadius: '12px' } } }}>
                                 <StripePaymentSection clientSecret={clientSecret} total={total} onFinalize={handleFinalize} />
                              </Elements>
                            </div>
                          ) : (
                            <div className="py-12 text-center space-y-4">
                               <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Vault link inactive</p>
                               <Button variant="outline" size="sm" onClick={() => initVault()} className="h-10 rounded-xl text-[10px] font-black uppercase">Retry Link</Button>
                            </div>
                          )}
                          
                          <div className="p-5 bg-white border border-zinc-100 rounded-xl space-y-4">
                             <div className="flex items-center gap-3">
                                <Checkbox id="billingSame" checked className="w-4 h-4 rounded border-zinc-300 text-zinc-900" />
                                <label htmlFor="billingSame" className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest cursor-pointer">Use shipping address as billing address</label>
                             </div>
                          </div>
                      </div>
                  </div>

                  {/* Save Information Section */}
                  <div className="pt-8 border-t border-zinc-100 space-y-4">
                     <div className="flex items-center justify-between">
                        <h3 className="text-[12px] font-black text-zinc-900 uppercase tracking-tight">Save my information for a faster checkout</h3>
                        <button className="text-[10px] font-bold text-zinc-400 hover:text-black transition-colors">Not now</button>
                     </div>
                     <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed max-w-md">
                        By paying, you agree to create a Shop account subject to Shop&apos;s <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                     </p>
                  </div>
               </section>

               <div className="pt-8 space-y-12 pb-20">
                  <div className="flex flex-wrap gap-x-8 gap-y-4 pt-12 border-t border-zinc-50">
                     {['Refund policy', 'Shipping policy', 'Privacy protocol', 'Terms of service', 'Contact'].map((link) => (
                        <a key={link} href="#" className="text-[9px] font-black text-zinc-300 underline underline-offset-4 uppercase tracking-widest hover:text-black transition-colors">{link}</a>
                     ))}
                  </div>
               </div>
             </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="p-6 lg:p-12 bg-[#F5F5F5]">
             <div className="max-w-[400px] space-y-8 sticky top-[120px]">
                
                {/* Product Manifest Card */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm space-y-8">
                   <div className="flex items-center gap-4 border-b border-zinc-50 pb-6">
                      <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
                         <Receipt className="w-5 h-5" />
                      </div>
                      <h3 className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.3em]">Inventory Manifest</h3>
                   </div>

                   <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                      {isMounted && items && items.length > 0 ? (
                         items.map((item) => (
                           <div key={item.id} className="flex gap-5 items-center group">
                              <div className="relative w-20 h-20 bg-zinc-50 rounded-2xl border border-zinc-100 p-2 flex-shrink-0 group-hover:border-emerald-500/20 transition-all">
                                 <Image src={getSmartSrc(item.image_url)} alt={item.name} fill className="object-contain p-2 transition-transform duration-700 group-hover:scale-105" unoptimized={true} />
                                 <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                    {item.quantity}
                                 </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-tight leading-relaxed line-clamp-2">{item.name}</h4>
                                 <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Industrial Edition</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-sm font-black text-zinc-900 tracking-tighter">${(parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}</p>
                              </div>
                           </div>
                         ))
                      ) : (
                         <div className="py-20 text-center space-y-4 opacity-30">
                            <ShoppingBag className="w-12 h-12 text-zinc-900 mx-auto" />
                            <p className="text-[9px] font-black text-zinc-900 uppercase tracking-widest">Manifest Empty</p>
                         </div>
                      )}
                   </div>

                    {/* Discount Input */}
                    <div className="space-y-3 pt-6 border-t border-zinc-50">
                       <div className="flex gap-3">
                          <Input 
                            value={discountCode} 
                            onChange={(e) => setDiscountCode(e.target.value)} 
                            placeholder="Discount code" 
                            className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50 px-5 text-[10px] font-black uppercase tracking-widest focus:bg-white transition-all" 
                          />
                          <Button 
                            type="button"
                            onClick={handleApplyDiscount}
                            className="h-12 px-6 rounded-xl bg-black text-white hover:bg-[#1a4d2e] font-black text-[10px] uppercase tracking-widest transition-all border-0"
                          >
                            Apply
                          </Button>
                       </div>
                       {appliedDiscount && (
                          <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                             <span className="flex items-center gap-2">
                                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                                {appliedDiscount.code} ({appliedDiscount.percent}% OFF)
                             </span>
                             <button 
                               type="button" 
                               onClick={handleRemoveDiscount}
                               className="text-emerald-600 hover:text-red-500 transition-colors font-bold"
                             >
                                Remove
                             </button>
                          </div>
                       )}
                    </div>

                    {/* Total Summary */}
                    <div className="space-y-4 pt-6">
                       <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          <span>Subtotal</span>
                          <span className="text-zinc-900">${isMounted ? subtotal.toFixed(2) : "0.00"}</span>
                       </div>
                       {appliedDiscount && (
                          <div className="flex justify-between text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                             <span>Discount ({appliedDiscount.percent}%)</span>
                             <span>-${discountAmount.toFixed(2)}</span>
                          </div>
                       )}
                       <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          <div className="flex items-center gap-1.5">Shipping <HelpCircle className="w-3.5 h-3.5 opacity-20" /></div>
                          <span className="text-zinc-900">${shipping.toFixed(2)}</span>
                       </div>
                      <div className="flex justify-between items-end pt-8 border-t border-zinc-50">
                         <div>
                            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest block mb-1">Final Settlement</span>
                            <span className="text-2xl font-black text-zinc-900 tracking-tighter uppercase leading-none">Total</span>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-1">PKR</p>
                            <p className="text-4xl font-black text-zinc-900 tracking-tighter leading-none">${isMounted ? total.toFixed(2) : "..."}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Secure Badge */}
                <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 flex items-center gap-5">
                   <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 border border-emerald-100">
                      <ShieldCheck className="w-6 h-6" strokeWidth={2.5} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Settlement Verified</p>
                      <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest leading-relaxed">
                         Industrial Protocol Active.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
