"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, ShoppingBag, Plus, Minus, 
  CheckCircle2, HelpCircle, Award, Star, 
  ShieldCheck, ArrowRight, Package, Info, AlertTriangle, X, Upload, 
  FileText, Loader2, Feather, RefreshCw, Box, Sparkles, Paintbrush, 
  Layers, DollarSign, Headset, Truck, Zap, Lock, Minus as MinusIcon, Plus as PlusIcon, 
  MessageSquare, User, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useCartStore } from "@/store/useCartStore";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { BestSellers } from "@/components/BestSellers";
import Link from "next/link";
import { getSmartSrc } from "@/lib/utils";
import { CustomDesign } from "@/components/CustomDesign";
import { RequestModal } from "@/components/RequestModal";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(150);
  const [imprint, setImprint] = useState("Front");
  const [colorComplexity, setColorComplexity] = useState("1 Color");
  const [activeThumb, setActiveThumb] = useState(0);
  
  // Modal & Form States
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Review State
  const [reviews, setReviews] = useState<any[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(true);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, reviewText: "" });
  
  // Verification State
  const [isVerifiedPurchaser, setIsVerifiedPurchaser] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  const fallbacks: any[] = [
    { id: 'f-1', name: 'Premium Signature Tote', price: '$45.00', category: 'Luxury', image_url: '/images/sell-1.jpeg' },
    { id: 'f-2', name: 'Eco-Friendly Grocery Bag', price: '$35.00', category: 'Retail', image_url: '/images/sell-2.jpeg' },
    { id: 'f-3', name: 'Luxury Gift Bag', price: '$55.00', category: 'Events', image_url: '/images/sell-3.jpeg' },
    { id: 'f-4', name: 'Industrial Storage Tote', price: '$65.00', category: 'Industrial', image_url: '/images/sell-4.jpeg' },
    { id: 'f-5', name: 'Promotional Giveaway Bag', price: '$30.00', category: 'Marketing', image_url: '/images/sell-5.jpeg' },
    { id: 'f-6', name: 'Chemical Industrial Series', price: '$75.00', category: 'Chemical Industrial', image_url: '/images/shop-1.avif' },
    { id: 'f-7', name: 'Medical Supply Protocol', price: '$60.00', category: 'Medical Supply', image_url: '/images/shop-2.avif' },
    { id: 'f-8', name: 'Retail Packaging Unit', price: '$40.00', category: 'Retail Packaging', image_url: '/images/shop-3.avif' },
    { id: 'f-9', name: 'Agricultural Feed System', price: '$50.00', category: 'Agricultural Feed', image_url: '/images/shop-4.avif' },
    { id: 'f-10', name: 'Marketing Tote Carrier', price: '$35.00', category: 'Marketing Tote', image_url: '/images/shop-5.avif' },
    { id: 'f-11', name: 'Onyx Series D-Cut', price: '$55.00', category: 'Luxury', image_url: '/images/feature-1.jpeg' },
    { id: 'f-12', name: 'Veridian Eco-Loop', price: '$45.00', category: 'Eco', image_url: '/images/feature-2.jpeg' },
    { id: 'f-13', name: 'Titan Industrial Series', price: '$70.00', category: 'Heavy Duty', image_url: '/images/feature-3.jpeg' },
    { id: 'f-14', name: 'Elite Canvas Protocol', price: '$60.00', category: 'Bespoke', image_url: '/images/feature-4.jpeg' },
    { id: 'f-15', name: 'Midnight Cargo Unit', price: '$65.00', category: 'Logistics', image_url: '/images/feature-5.jpeg' },
    { id: 'sig-1', name: 'Signature D-Cut Elite', price: '$55.00', category: 'D-Cut Tote Bags', image_url: '/images/style-1.jpeg' },
    { id: 'sig-2', name: 'Premium Handled Carrier', price: '$50.00', category: 'Handled Tote Bags', image_url: '/images/style-2.jpeg' },
    { id: 'sig-3', name: 'Industrial Squared Unit', price: '$60.00', category: 'Squared Tote Bags', image_url: '/images/style-3.jpeg' },
    { id: 'sig-4', name: 'Architectural Gusset Bag', price: '$65.00', category: 'Bottom Gusset Tote Bags', image_url: '/images/style-4.jpeg' },
    { id: 'sig-5', name: 'Global Shopping Protocol', price: '$45.00', category: 'Shopping Bags', image_url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop' },
  ];

  // Consistent price formatter — always shows $XX.XX
  const formatPrice = (price: string | number): string => {
    const num = parseFloat(String(price).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return '$0.00';
    return `$${num.toFixed(2)}`;
  };

  const galleryImages = product?.images && product.images.length > 0 
    ? product.images 
    : [product?.image_url].filter(Boolean) as string[];

  const checkPurchaserStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setCurrentUserEmail(session.user.email);
      }
      
      // Check if any delivered order exists for this product case-insensitively
      const { data: orders } = await supabase
        .from('orders')
        .select('items, status');
        
      let hasBought = false;
      if (orders && orders.length > 0) {
        hasBought = orders.some(order => {
          const isDeliv = order.status?.toLowerCase().includes('deliver');
          if (!isDeliv) return false;
          const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
          return items.some((item: any) => item.id === String(id));
        });
      }
      
      // Enforce strict review capability check based on delivered manifests
      setIsVerifiedPurchaser(hasBought);
    } catch (err) {
      console.error("Error verifying purchaser status:", err);
      setIsVerifiedPurchaser(false);
    }
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data && data.length > 0) setReviews(data);
    else {
      setReviews([
        { id: 1, name: "Ahmed Khan", rating: 5, review: "EXCEPTIONAL BUILD QUALITY. THE 100 GSM MATERIAL IS EXACTLY WHAT WE NEEDED.", created_at: new Date().toISOString() },
        { id: 2, name: "Sarah J.", rating: 5, review: "THE IMPRINT CLARITY IS PROFESSIONAL. OUR LOGOS LOOK SHARP.", created_at: new Date().toISOString() },
        { id: 3, name: "Industrial Procure", rating: 5, review: "BULK SHIPMENT WAS HANDLED WITH CARE. HIGHLY RECOMMENDED FOR WHOLESALE.", created_at: new Date().toISOString() }
      ]);
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      
      // 1. Try Supabase first
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setProduct(data);
        setLoading(false);
        fetchReviews();
        return;
      }

      // 2. Handle Fallbacks and Simulations
      const idStr = String(id);
      
      // Check hardcoded fallbacks
      const matchingFallback = fallbacks.find(f => f.id === idStr);
      if (matchingFallback) {
        setProduct({
          ...matchingFallback,
          type: "fallback"
        } as Product);
        setLoading(false);
        fetchReviews();
        return;
      }

      // Check for simulated IDs (e.g., sim-Category-Index or sim-style-Index)
      if (idStr.startsWith("sim-")) {
        const parts = idStr.split("-");
        
        let category = "Industrial";
        let index = 0;

        if (parts.length >= 3) {
           if (parts[1] === "style") {
              index = parseInt(parts[2]) || 0;
              const styles = ["D-Cut Tote Bags", "Bottom Gusset Tote Bags", "Squared Tote Bags", "Handled Tote Bags", "Shopping Bags"];
              category = styles[index % styles.length];
           } else {
              index = parseInt(parts[parts.length - 1]) || 0;
              category = parts.slice(1, parts.length - 1).join(" ");
           }
        }

        const variants = ["Elite Unit", "Structural Series", "Architectural Grade", "Industrial Spec", "Authoritative Silhouette", "Bespoke Variant", "Premium Manifest", "Signature Series"];
        const nameVariant = variants[index % variants.length];
        
        // SYNC IMAGE LOGIC WITH CATEGORY PAGE
        const categoryOffset = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const imgIndex = ((categoryOffset + index) % 15) + 1;

        const simulatedProduct: Product = {
          id: idStr,
          name: `${category} ${nameVariant}`.toUpperCase(),
          price: `$${(35 + (index * 7) % 41).toFixed(2)}`,
          category: category,
          image_url: `/images/product-${imgIndex}.webp`,
          description: "Premium heavy-duty non-woven engineering built for robust industrial deployment and sleek retail identity layouts.",
          type: "simulation"
        };

        setProduct(simulatedProduct);
        setLoading(false);
        fetchReviews();
        return;
      }

      // 3. Absolute Default (Last Resort)
      setProduct({
        id: idStr,
        name: "Reusable Heavy-Duty Non-Woven Tote Bag",
        price: "$50.00",
        category: "Industrial",
        image_url: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80",
        description: "Industrial strength heat-sealed non-woven structure providing excellent transport utility and corporate branding prominence.",
        type: "simulation"
      });
      setLoading(false);
      fetchReviews();
    }
    fetchProduct();
    checkPurchaserStatus();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerifiedPurchaser) {
      toast.error("PURCHASING PROTOCOL REQUIRED", { description: "Only clients with delivered manifests can submit feedback." });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert([{ 
        name: newReview.name, 
        rating: newReview.rating, 
        review: newReview.reviewText,
        product_id: String(id),
        user_email: currentUserEmail,
        is_verified: true
      }]);
      
      if (error) throw error;
      
      toast.success("FEEDBACK SYNCHRONISED");
      setNewReview({ name: "", rating: 5, reviewText: "" });
      setShowReviewForm(false);
      fetchReviews();
    } catch (error: any) {
      toast.error(`SUBMISSION ERROR: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
       <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  const handleAddToCart = () => {
    if (quantity < 150) {
      toast.error("MINIMUM ORDER QUANTITY: 150");
      return;
    }
    addItem({ ...product, quantity: quantity, price: typeof product.price === 'number' ? `$${Number(product.price).toFixed(2)}` : (String(product.price).includes('$') ? product.price : `$${product.price}`) });
    router.push("/cart");
  };

  const MOQ = 150;
  const isMoqViolated = quantity < MOQ;

  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-emerald-500 selection:text-white antialiased">
      <Navbar />

      <div className="pt-20 pb-24">
        <div className="border-b border-zinc-50 mb-6">
          <div className="container mx-auto px-6 py-3">
            <nav className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400">
              <Link href="/" className="hover:text-emerald-600 transition-colors">CORE</Link>
              <ChevronRight className="w-2.5 h-2.5 text-zinc-300" />
              <Link href="/shop-all" className="hover:text-emerald-600 transition-colors">STORE</Link>
              <ChevronRight className="w-2.5 h-2.5 text-zinc-300" />
              <span className="text-zinc-600 truncate max-w-[200px]">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Main Product Grid */}
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-12 lg:gap-20 items-start pb-16 border-b border-zinc-100">
          
          {/* Column A: Polished Visual Core (Sticky) */}
          <div className="lg:sticky lg:top-32 self-start flex flex-col gap-6 h-fit">
             <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden relative group aspect-square flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.04)_0%,_transparent_60%)]" />
                <motion.div 
                  key={activeThumb} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full p-10"
                >
                   <Image 
                     src={getSmartSrc(galleryImages[activeThumb] || product.image_url)} 
                     alt={product.name} 
                     fill 
                     className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform duration-1000 ease-out" 
                     priority 
                     unoptimized={true} 
                   />
                </motion.div>
                <div className="absolute bottom-6 right-6 flex gap-2">
                   <div className="px-3 py-1 bg-white/90 backdrop-blur border border-zinc-100 rounded-full text-[8px] font-semibold uppercase tracking-widest shadow-sm">Industrial Grade</div>
                </div>
             </div>
             
             {/* Polished Thumbnail Gallery */}
             <div className="flex gap-3 justify-center">
                {galleryImages.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveThumb(i)}
                    className={`aspect-square w-16 bg-white rounded-xl border-2 transition-all overflow-hidden p-1.5 relative ${activeThumb === i ? 'border-emerald-500 shadow-md scale-105' : 'border-zinc-100 hover:border-zinc-200'}`}
                  >
                     <Image src={getSmartSrc(img)} alt={`Unit Variant ${i + 1}`} fill className="object-contain" unoptimized={true} />
                  </button>
                ))}
             </div>
          </div>

          {/* Column B: Configuration and Details */}
          <div className="space-y-12">
            <div className="space-y-4">
               <h1 className="text-2xl md:text-4xl font-semibold tracking-tight uppercase leading-[1.05] text-zinc-900">{product.name}</h1>
               <div className="flex items-center gap-5">
                 <span className="text-3xl font-semibold text-emerald-600 tracking-tighter">{formatPrice(product.price)}</span>
                 <div className="h-5 w-px bg-zinc-200" />
                 <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-[0.25em] bg-zinc-100 px-3 py-1 rounded-full">Verified Industrial Stock</span>
               </div>
            </div>

            <div className={`p-5 rounded-xl border flex items-center gap-4 transition-all ${isMoqViolated ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/30 border-emerald-100'}`}>
               <ShieldCheck className={`w-5 h-5 ${isMoqViolated ? 'text-red-600' : 'text-emerald-600'}`} />
               <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${isMoqViolated ? 'text-red-800' : 'text-emerald-800'}`}>MOQ Protocol: 150 Pieces Required for production</span>
            </div>

            {/* Imprint Configuration */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Imprint Location</h3>
                  <div className="flex-1 h-px bg-zinc-100" />
               </div>
               <div className="grid grid-cols-3 gap-3">
                  {["None", "Front", "Dual Side"].map((opt) => (
                     <button key={opt} onClick={() => setImprint(opt)} className={`h-12 border rounded-lg text-[9px] font-semibold uppercase tracking-[0.2em] transition-all ${imprint === opt ? 'bg-[#1a4d2e] text-white border-[#1a4d2e]' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400'}`}>{opt}</button>
                  ))}
               </div>
               <AnimatePresence>
                 {imprint !== "None" && (
                   <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Color Complexity</h3>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                         {["1 Color", "2 Color", "3 Color", "4+"].map((opt) => (
                            <button key={opt} onClick={() => setColorComplexity(opt)} className={`h-12 border rounded-lg text-[9px] font-semibold uppercase tracking-[0.2em] transition-all ${colorComplexity === opt ? 'bg-[#1a4d2e] text-white border-[#1a4d2e] shadow-lg shadow-emerald-900/10' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400'}`}>{opt}</button>
                         ))}
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Order Interface */}
            <div className="space-y-6 pt-2">
               <div className="flex items-center gap-6">
                  <Label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400 whitespace-nowrap">Target Quantity:</Label>
                  <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg p-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 50))} className="p-2 hover:bg-zinc-200 rounded-md transition-colors"><MinusIcon className="w-3 h-3" /></button>
                    <Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-20 h-9 border-none bg-transparent text-[14px] font-bold text-center focus:ring-0" />
                    <button onClick={() => setQuantity(quantity + 50)} className="p-2 hover:bg-zinc-200 rounded-md transition-colors"><PlusIcon className="w-3 h-3" /></button>
                  </div>
               </div>
               <Button onClick={handleAddToCart} disabled={isMoqViolated} className={`w-full h-14 rounded-xl font-bold uppercase tracking-[0.25em] text-[12px] transition-all shadow-xl active:scale-[0.98] ${isMoqViolated ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-[#1a4d2e] text-white hover:bg-[#163d25] hover:shadow-emerald-900/20'}`}>Initiate Procurement pipeline</Button>
            </div>

            {/* Comprehensive Pricing Matrix */}
            <AnimatePresence>
               {imprint !== "None" && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-8">
                   <div className="flex items-center gap-3"><h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Imprint Cost matrix</h3><div className="flex-1 h-px bg-zinc-100" /></div>
                   <div className="overflow-hidden rounded-xl border border-zinc-100 shadow-sm">
                     <table className="w-full text-left bg-zinc-50/20">
                       <thead><tr className="bg-zinc-800 text-white"><th className="p-4 text-[9px] font-semibold uppercase tracking-[0.2em]">Color Variant</th><th className="p-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-center">Front Side</th><th className="p-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-center">Dual Side</th></tr></thead>
                       <tbody className="text-[10px] font-bold uppercase text-zinc-600">
                         {[{ c: "1 Color", f: "$0.25 EACH", b: "$0.50 EACH" }, { c: "2 Color", f: "$0.50 EACH", b: "$0.90 EACH" }, { c: "3 Color", f: "$0.75 EACH", b: "$1.30 EACH" }, { c: "4+ Color", f: "$1.00 EACH", b: "$1.50 EACH" }].map((row, i) => (
                           <tr key={i} className="border-b border-zinc-100 hover:bg-white transition-colors"><td className="p-4 text-zinc-900 font-semibold">{row.c}</td><td className="p-4 text-center text-emerald-600 font-semibold">{row.f}</td><td className="p-4 text-center text-emerald-600 font-semibold">{row.b}</td></tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </motion.div>
               )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4 pt-6">
               <Button onClick={() => setShowQuoteModal(true)} className="h-12 rounded-lg bg-[#a3c644] text-white font-semibold uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all shadow-md">Get formal Quote</Button>
               <Button onClick={() => setShowSampleModal(true)} className="h-12 rounded-lg bg-[#a3c644] text-white font-semibold uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all shadow-md">Request Sample</Button>
            </div>

            {/* RESTORED: Description Portal */}
            <div className="space-y-6 pt-10 border-t border-zinc-100">
               <h2 className="text-[12px] font-semibold uppercase tracking-[0.25em] text-zinc-900">INDUSTRIAL DESCRIPTION</h2>
               <p className="text-[11px] text-zinc-500 font-bold uppercase leading-relaxed tracking-[0.15em]">GIVE CARRIAGE THE CLASS AND DURABILITY IT DESERVES WITH THESE NON-WOVEN TOTE BAGS. SPACIOUS AND FLEXIBLE BY NATURE, THESE BAGS ARE PERFECT TO CARRY PURCHASED ITEMS. THANKS TO 70-100 GSM, THESE BAGS LAST MUCH LONGER THAN OTHER ALTERNATIVES.</p>
            </div>

            {/* RESTORED: Complete Features Suite with Icons */}
            <div className="space-y-10 pt-10 border-t border-zinc-100">
               <h2 className="text-[12px] font-semibold uppercase tracking-[0.25em] text-zinc-900">TECHNICAL SPECIFICATIONS</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[{ icon: <Feather className="w-4 h-4" />, text: "LIGHTWEIGHT BUILD" }, { icon: <RefreshCw className="w-4 h-4" />, text: "RECYCLABLE POLY" }, { icon: <Box className="w-4 h-4" />, text: "HEAT-SEALED JOINTS" }, { icon: <Sparkles className="w-4 h-4" />, text: "SPOT CLEAN PROTOCOL" }, { icon: <Paintbrush className="w-4 h-4" />, text: "CUSTOM PRINT READY" }, { icon: <Layers className="w-4 h-4" />, text: "70-100 GSM GRADE" }].map((feat, i) => (
                    <div key={i} className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-sm">{feat.icon}</div><span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">{feat.text}</span></div>
                  ))}
               </div>
            </div>

            {/* RESTORED: Industrial Trust Grid */}
            <div className="space-y-10 pt-10 border-t border-zinc-100">
               <h2 className="text-[12px] font-semibold uppercase tracking-[0.25em] text-zinc-900">BUSINESS PROTOCOL BENEFITS</h2>
               <div className="grid grid-cols-4 gap-6">
                  {[{ icon: <DollarSign className="w-5 h-5" />, label: "WHOLESALE" }, { icon: <Headset className="w-5 h-5" />, label: "CONSULTATION" }, { icon: <Truck className="w-5 h-5" />, label: "EXPRESS" }, { icon: <ShoppingBag className="w-5 h-5" />, label: "CUSTOM BRAND" }].map((benefit, i) => (
                    <div key={benefit.label} className="flex flex-col items-center text-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white shadow-xl">{benefit.icon}</div>
                       <span className="text-[7px] font-semibold uppercase tracking-[0.2em] text-zinc-500 leading-tight">{benefit.label}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* RESTORED: Secured Payments */}
            <div className="space-y-8 pt-10 border-t border-zinc-100">
               <div className="flex items-center gap-3"><h2 className="text-[12px] font-semibold uppercase tracking-[0.25em] text-zinc-900">SECURED PAYMENT</h2><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
               <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {["AMEX", "APPLE", "DISC", "META", "GPAY", "MC", "SHOP", "VISA"].map((pay) => (
                    <div key={pay} className="h-10 bg-white border border-zinc-100 rounded-lg flex items-center justify-center shadow-sm"><span className="text-[7px] font-semibold uppercase text-zinc-400 tracking-tighter">{pay}</span></div>
                  ))}
               </div>
            </div>

            {/* RESTORED: Feedback Dashboard */}
            <div className="space-y-8 pt-10 border-t border-zinc-100">
               <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsReviewOpen(!isReviewOpen)}>
                  <h2 className="text-[12px] font-semibold uppercase tracking-[0.25em] text-zinc-900">FEEDBACK DASHBOARD</h2>
                  <PlusIcon className={`w-4 h-4 transition-transform ${isReviewOpen ? 'rotate-45' : ''}`} />
               </div>
               <AnimatePresence>
                 {isReviewOpen && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-2">
                       <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-50">
                          <div className="flex items-center gap-3">
                             <div className="flex text-amber-500">{[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}</div>
                             <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">{reviews.length} REVIEWS SYNCED</span>
                          </div>
                          <button onClick={() => {
                              if (!isVerifiedPurchaser) {
                                 toast.error("PURCHASING PROTOCOL REQUIRED", { description: "Only clients with delivered manifests can submit feedback." });
                              } else {
                                 setShowReviewForm(true);
                              }
                           }} className={`text-[10px] font-semibold uppercase tracking-widest underline underline-offset-4 transition-colors ${isVerifiedPurchaser ? 'text-emerald-600 hover:text-zinc-900' : 'text-zinc-400 hover:text-zinc-500 cursor-not-allowed'}`}>
                              WRITE REVIEW
                           </button>
                       </div>
                       <div className="grid grid-cols-1 gap-6">
                         {reviews.map((rev) => (
                           <div key={rev.id} className="p-5 bg-zinc-50/50 rounded-xl border border-zinc-100 shadow-sm hover:border-emerald-500/20 transition-all">
                              <div className="flex items-center justify-between mb-3">
                                 <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-semibold uppercase text-zinc-900">{rev.name}</span>
                                    {(rev.is_verified || rev.id < 10) && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                                 </div>
                                 <div className="flex text-amber-500">{[1,2,3,4,5].map(i => <Star key={i} className="w-2 h-2 fill-current" />)}</div>
                              </div>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-wide italic">&quot;{rev.review}&quot;</p>
                           </div>
                         ))}
                       </div>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RESTORED: Complete FAQ Suite */}
        <div className="container mx-auto px-6 pt-24 pb-20">
           <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-semibold uppercase tracking-tight text-zinc-900">OPERATIONAL PROTOCOLS</h2>
              <div className="w-12 h-1 bg-emerald-500 mx-auto mt-4" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 max-w-5xl mx-auto">
              {[
                { q: "LOGO TRANSMISSION PROTOCOL?", a: "TRANSMIT LOGOS VIA OUR SECURE UPLOAD SYSTEM IN PDF, AI, OR HIGH-RES IMAGE FORMATS." },
                { q: "PROCESSING TIME-FRAME?", a: "INDUSTRIAL PROCESSING: 3-5 DAYS; EXPRESS DELIVERY: 7-10 BUSINESS DAYS." },
                { q: "TRACKING PERSISTENCE?", a: "TRACKING PROTOCOLS ACTIVATED IMMEDIATELY UPON DISPATCH FOR REAL-TIME LOGISTICS VISIBILITY." },
                { q: "FREIGHT CALCULATIONS?", a: "CALCULATED BY VOLUME. OPTIMIZED RATES FOR BULK ENTERPRISE FREIGHT." },
                { q: "TRACKING PERSISTENCE PROTOCOL?", a: "UNIQUE LOGISTICS IDENTIFIER ASSIGNED FOR PERSISTENT TRACKING THROUGH CARRIER NETWORKS." },
                { q: "INTERNATIONAL CAPABILITIES?", a: "DELIVERY CAPABILITIES AVAILABLE FOR LARGE-SCALE INTERNATIONAL ENTERPRISE ORDERS." },
                { q: "RETURN/REFUND PROTOCOL?", a: "CASE-BY-CASE PROTOCOL FOCUSING ON MATERIAL DEFECTS OR PRINT DEVIATIONS." },
                { q: "CUSTOM ORDER CANCELLATION?", a: "CANCELLATIONS NOT POSSIBLE ONCE INDUSTRIAL PRODUCTION PROTOCOLS COMMENCE." },
                { q: "EXCHANGE POLICY?", a: "APPLICABLE FOR NON-CUSTOMIZED ITEMS WITHIN 14 DAYS OF DELIVERY PROTOCOL." },
                { q: "DEFECTIVE ITEM HANDLING?", a: "NOTIFY PROTOCOL TEAM WITHIN 48 HOURS FOR IMMEDIATE REPLACEMENT SYNCHRONISATION." },
                { q: "LOGISTICS FAILURE (LOST)?", a: "ALL SHIPMENTS INSURED. IMMEDIATE RE-PRODUCTION PROTOCOLS INITIATED UPON LOSS CONFIRMATION." }
              ].map((faq, i) => (
                <div key={i} className="py-8 border-b border-zinc-100 group cursor-pointer hover:bg-zinc-50/30 px-3 transition-all">
                   <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-900 group-hover:text-emerald-600 transition-colors">{faq.q}</h3>
                      <PlusIcon className="w-4 h-4 text-zinc-300 group-hover:text-black transition-transform group-hover:rotate-45" />
                   </div>
                   <p className="mt-4 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] h-0 group-hover:h-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all leading-relaxed">{faq.a}</p>
                </div>
              ))}
           </div>
        </div>

        <CustomDesign />
        
        {/* Best Sellers Portal */}
        <BestSellers />
      </div>

      {/* Inquiry Protocol Modals */}
      <RequestModal 
        isOpen={showQuoteModal} 
        onClose={() => setShowQuoteModal(false)} 
        type="quote" 
        title="Get Formal Quote"
      />
      <RequestModal 
        isOpen={showSampleModal} 
        onClose={() => setShowSampleModal(false)} 
        type="sample" 
        title="Request a Sample Pack"
      />

      {/* Review Protocol Modal */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="bg-white border-zinc-200 text-zinc-900 w-[95vw] sm:w-full sm:max-w-[500px] rounded-2xl p-8 shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-bold text-zinc-800 uppercase tracking-tight">Write a Review</DialogTitle>
            <div className="w-8 h-1 bg-emerald-500 mt-2 rounded-full" />
          </DialogHeader>
          
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Your Name*</label>
               <Input 
                required 
                value={newReview.name} 
                onChange={(e) => setNewReview({...newReview, name: e.target.value})} 
                placeholder="ENTER YOUR NAME"
                className="bg-white border-zinc-200 h-12 rounded-lg text-sm"
              />
            </div>
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Rating*</label>
               <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setNewReview({...newReview, rating: star})}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-6 h-6 ${star <= newReview.rating ? 'text-amber-500 fill-current' : 'text-zinc-200'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Your Feedback*</label>
               <Textarea 
                required 
                value={newReview.reviewText} 
                onChange={(e) => setNewReview({...newReview, reviewText: e.target.value})} 
                placeholder="TELL US ABOUT YOUR EXPERIENCE..."
                className="bg-white border-zinc-200 min-h-[120px] rounded-lg text-sm"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full h-12 bg-zinc-900 text-white font-semibold uppercase tracking-[0.2em] text-xs hover:bg-black rounded-lg transition-all"
            >
               {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Submit Feedback"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
