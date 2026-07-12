"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { ChevronRight, LayoutGrid, List, Plus, ArrowRight, ShieldCheck, CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { getSmartSrc } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BestSellers } from "@/components/BestSellers";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image_url: string;
  type: string;
}

const CATEGORY_HERO_IMAGES: Record<string, string> = {
  "D-Cut Tote Bags": "https://images.unsplash.com/photo-1590736961918-71e582307975?q=80&w=800&auto=format&fit=crop",
  "Bottom Gusset Tote Bags": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
  "Squared Tote Bags": "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=800&auto=format&fit=crop",
  "Handled Tote Bags": "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
  "Shopping Bags": "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop",
};

const FAQ_DATA = [
  { q: "What is the minimum order for custom branding?", a: "For bespoke branding, we require a minimum order protocol of 500 units to ensure industrial-grade production efficiency." },
  { q: "What materials do you use for structural integrity?", a: "We primarily utilize GOTS-certified non-woven polypropylene ranging from 70 to 100 GSM, engineered for maximum weight distribution." },
  { q: "Can I request custom dimensions for my brand?", a: "Yes, our architectural team can develop custom silhouettes and dimensions tailored to your specific product fulfillment needs." },
  { q: "What is the standard production lifecycle?", a: "Once the identity artwork is authenticated, standard production takes 10-12 business days, followed by express global logistics." },
  { q: "Do you offer digital mockups before production?", a: "Every project includes a high-fidelity digital architecture preview to ensure your brand artwork aligns perfectly with the bag's structural form." },
  { q: "Are your carrier systems eco-compliant?", a: "All our materials are 100% recyclable and sourced from GOTS-compliant facilities to minimize environmental footprint." },
  { q: "What weight can these tote bags handle?", a: "Our 100 GSM series is stress-tested to support up to 15kg of inventory without compromising structural integrity." },
  { q: "Do you provide global door-to-door fulfillment?", a: "Yes, we operate a global logistics network delivering to over 45 countries with end-to-end tracking protocols." }
];

const ProductCard = ({ product, viewMode }: { product: Product, viewMode: "grid" | "list" }) => {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  if (viewMode === "list") {
    return (
      <Link 
        href={`/product/${product.id}`}
        className="group flex items-center gap-8 p-4 rounded-2xl border border-zinc-100 bg-zinc-50/30 hover:bg-white hover:border-emerald-500/20 transition-all cursor-pointer shadow-sm hover:shadow-xl"
      >
        <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-white border border-zinc-100 p-4 flex-shrink-0">
          <Image
            src={getSmartSrc(product.image_url)}
            alt={product.name}
            fill
            className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-black text-zinc-400 group-hover:text-black transition-colors uppercase tracking-[0.2em] mb-1">{product.name}</h3>
            <p className="text-lg font-black text-black tracking-tighter">
              {typeof product.price === 'number' ? `$${Number(product.price).toFixed(2)}` : (String(product.price).includes('$') ? product.price : `$${product.price}`)}
            </p>
          </div>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
              toast.success(`${product.name} added to bag!`, {
                action: {
                  label: "View Bag",
                  onClick: () => router.push("/cart")
                }
              });
            }}
            className="h-10 px-8 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md"
          >
            Add to Bag
          </Button>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/product/${product.id}`} 
      className="group relative flex flex-col cursor-pointer"
    >
      <div className="relative aspect-square w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 overflow-hidden p-6 transition-all duration-700 group-hover:border-emerald-500/30 group-hover:bg-white shadow-sm group-hover:shadow-2xl">
        <Image
          src={getSmartSrc(product.image_url)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain transition-transform duration-1000 group-hover:scale-105 p-4"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-500 z-10">
           <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
              toast.success(`${product.name} added to bag!`, {
                action: {
                  label: "View Bag",
                  onClick: () => router.push("/cart")
                }
              });
            }}
            className="h-9 px-6 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-widest"
          >
            Add to Bag
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center text-center px-2">
        <h3 className="text-[10px] font-black text-zinc-400 group-hover:text-black line-clamp-1 leading-relaxed mb-1 transition-colors uppercase tracking-[0.2em]">
          {product.name}
        </h3>
        <p className="text-sm font-black text-black group-hover:text-emerald-600 transition-colors tracking-tighter">
          {typeof product.price === 'number' ? `$${Number(product.price).toFixed(2)}` : (String(product.price).includes('$') ? product.price : `$${product.price}`)}
        </p>
      </div>
    </Link>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left transition-all group"
      >
        <span className={`text-[10px] font-black tracking-widest transition-all uppercase ${isOpen ? 'text-emerald-600' : 'text-zinc-500 group-hover:text-black'}`}>
          {question}
        </span>
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isOpen ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-zinc-200'}`}>
          <Plus className={`h-3 w-3 ${isOpen ? 'text-emerald-600' : 'text-zinc-400'}`} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-[9px] text-zinc-500 font-medium leading-relaxed max-w-2xl uppercase tracking-[0.2em]">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CategoryPage() {
  const params = useParams();
  const [categoryName, setCategoryName] = useState<string>("");
  const [originalCategoryName, setOriginalCategoryName] = useState<string>("");
  const [isStyleCollection, setIsStyleCollection] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortMode, setSortMode] = useState("Featured Index");

  const idxToVariant = (i: number) => {
    const variants = ["Elite Unit", "Structural Series", "Architectural Grade", "Industrial Spec", "Authoritative Silhouette", "Bespoke Variant", "Premium Manifest", "Signature Series"];
    return variants[i % variants.length];
  };

  useEffect(() => {
    const init = async () => {
      const categoryRaw = params?.category || params?.slug || "";
      const categoryStr = Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw;
      const decodedCategory = decodeURIComponent(categoryStr).replace(/-/g, " ");
      
      // Architectural Style Normalization
      const stylesList = [
        "D-Cut Tote Bag",
        "Handled Tote Bag",
        "Squared Tote Bag",
        "Bottom Gusset Bag",
        "Shopping Bag"
      ];
      
      const sidebarLinks = [
        "D-Cut Tote Bags",
        "Bottom Gusset Tote Bags",
        "Squared Tote Bags",
        "Handled Tote Bags",
        "Shopping Bags"
      ];

      // Check if current category is an architectural style
      const isStyle = stylesList.some(s => decodedCategory.toLowerCase().includes(s.toLowerCase())) || 
                    sidebarLinks.some(s => decodedCategory.toLowerCase().includes(s.toLowerCase().replace(' bags', '')));

      setOriginalCategoryName(decodedCategory);
      setIsStyleCollection(isStyle);

      if (isStyle) {
        const normalize = (name: string) => name.toLowerCase()
          .replace(/s$/, '')
          .replace('bags', '')
          .replace('bag', '')
          .replace('totes', '')
          .replace('tote', '')
          .trim();

        const matchedStyleLink = sidebarLinks.find(link => normalize(link) === normalize(decodedCategory)) || decodedCategory;
        setCategoryName(matchedStyleLink);
        
        // Define the representative signature products from the homepage section
        const signatureStyles: Product[] = [
          { id: 'sig-1', name: 'Signature D-Cut Elite', price: '$3200.00', category: 'D-Cut Tote Bags', image_url: '/images/style-1.jpeg', type: 'signature' },
          { id: 'sig-2', name: 'Premium Handled Carrier', price: '$3500.00', category: 'Handled Tote Bags', image_url: '/images/style-2.jpeg', type: 'signature' },
          { id: 'sig-3', name: 'Industrial Squared Unit', price: '$3800.00', category: 'Squared Tote Bags', image_url: '/images/style-3.jpeg', type: 'signature' },
          { id: 'sig-4', name: 'Architectural Gusset Bag', price: '$4200.00', category: 'Bottom Gusset Tote Bags', image_url: '/images/style-4.jpeg', type: 'signature' },
          { id: 'sig-5', name: 'Global Shopping Protocol', price: '$2800.00', category: 'Shopping Bags', image_url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop', type: 'signature' }
        ];

        const matchedSignature = signatureStyles.filter(sig => normalize(sig.category) === normalize(decodedCategory));

        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("category", matchedStyleLink);

        if (data && data.length > 0) {
          // Merge signature products with database products
          setProducts([...matchedSignature, ...data]);
        } else {
          // Simulation for this specific style
          const categoryOffset = matchedStyleLink.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const simulatedItems: Product[] = Array.from({ length: 15 }, (_, i) => {
            const imgIndex = ((categoryOffset + i) % 15) + 1;
            return {
              id: `sim-${matchedStyleLink.replace(/\s+/g, '-')}-${i}`,
              name: `${matchedStyleLink} ${idxToVariant(i)}`,
              price: `$${(35 + (i * 7) % 41).toFixed(2)}`,
              category: matchedStyleLink,
              image_url: `/images/product-${imgIndex}.webp`,
              type: 'simulation'
            };
          });
          setProducts([...matchedSignature, ...simulatedItems]);
        }
      } else {
        setCategoryName(decodedCategory);
        const { data } = await supabase
          .from("products")
          .select("*")
          .ilike("category", decodedCategory);

        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // High-Fidelity Fallback Logic: Strict Category Classification
          const usageSeries = [
            { id: 'f-6', name: 'Chemical Industrial Series', price: '$5500.00', category: 'Chemical Industrial', image_url: '/images/shop-1.avif', type: 'fallback' },
            { id: 'f-7', name: 'Medical Supply Protocol', price: '$4200.00', category: 'Medical Supply', image_url: '/images/shop-2.avif', type: 'fallback' },
            { id: 'f-8', name: 'Retail Packaging Unit', price: '$850.00', category: 'Retail Packaging', image_url: '/images/shop-3.avif', type: 'fallback' },
            { id: 'f-9', name: 'Agricultural Feed System', price: '$2100.00', category: 'Agricultural Feed', image_url: '/images/shop-4.avif', type: 'fallback' },
            { id: 'f-10', name: 'Marketing Tote Carrier', price: '$1500.00', category: 'Marketing Tote', image_url: '/images/shop-5.avif', type: 'fallback' }
          ];

          const usageKeys = [
            "Chemical Industrial", "Industrial", "Healthcare", "Medical Supply", 
            "Retail", "Retail Packaging", "Agriculture", "Agricultural Feed", 
            "Marketing", "Marketing Tote"
          ];

          const isUsageCategory = usageKeys.includes(decodedCategory);
          const categoryOffset = decodedCategory.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

          const simulatedItems: Product[] = Array.from({ length: 15 }, (_, i) => {
            const imgIndex = ((categoryOffset + i) % 15) + 1;
            return {
              id: `sim-${decodedCategory.replace(/\s+/g, '-')}-${i}`,
              name: `${decodedCategory} ${idxToVariant(i)}`,
              price: `$${(35 + (i * 7) % 41).toFixed(2)}`,
              category: decodedCategory,
              image_url: `/images/product-${imgIndex}.webp`,
              type: 'simulation'
            };
          });

          if (isUsageCategory) {
            setProducts([...usageSeries, ...simulatedItems]);
          } else {
            setProducts(simulatedItems);
          }
        }
      }
      setIsLoading(false);
    };
    init();
  }, [params]);

  const sortedProducts = useMemo(() => {
    const p = [...products];
    const getPrice = (item: any) => typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;

    if (sortMode === "Price Ascending") {
      return p.sort((a, b) => getPrice(a) - getPrice(b));
    }
    if (sortMode === "Price Descending") {
      return p.sort((a, b) => getPrice(b) - getPrice(a));
    }
    return p;
  }, [products, sortMode]);

  const sidebarLinks = [
    "D-Cut Tote Bags",
    "Bottom Gusset Tote Bags",
    "Squared Tote Bags",
    "Handled Tote Bags",
    "Shopping Bags"
  ];

  const heroImage = CATEGORY_HERO_IMAGES[categoryName] || (products.length > 0 ? getSmartSrc(products[0].image_url) : "/images/product-1.webp");

  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <div className="relative pt-32 pb-24">
        <div className="container mx-auto px-6 mb-8">
          <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Core</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/collections" className="hover:text-emerald-600 transition-colors">Archive</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-900">{isStyleCollection ? originalCategoryName : categoryName}</span>
          </nav>
        </div>

        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <aside className="w-full lg:w-[260px] lg:sticky lg:top-32 self-start shrink-0 z-10">
              <div className="rounded-3xl border border-zinc-100 bg-white overflow-hidden shadow-sm">
                <div className="bg-[#1a4d2e] px-8 py-5">
                  <h2 className="text-[10px] font-black tracking-[0.3em] text-white text-center uppercase">Architectural Styles</h2>
                </div>
                <ul className="py-2">
                  {sidebarLinks.map((link) => (
                    <li key={link}>
                      <Link 
                        href={`/category/${encodeURIComponent(link)}`} 
                        className={`flex items-center px-8 py-3.5 text-[10px] font-black transition-all uppercase tracking-widest ${originalCategoryName === link || (originalCategoryName.toLowerCase().includes(link.toLowerCase().replace(' bags', '')) && isStyleCollection) ? "text-emerald-600 bg-emerald-50/50" : "text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50/50"}`}
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 p-8 rounded-3xl bg-zinc-50 border border-zinc-100 group">
                <h3 className="text-sm font-black mb-3 text-black uppercase tracking-tight">Signature <br/><span className="text-emerald-600 italic font-serif normal-case tracking-normal">Engineering</span></h3>
                <p className="text-[9px] text-zinc-500 leading-relaxed mb-6 font-bold uppercase tracking-widest">Bespoke carrier systems for global brands.</p>
                <Link href="/design-your-bag">
                  <Button className="h-11 w-full rounded-full bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md">
                    Start Customization
                  </Button>
                </Link>
              </div>
            </aside>

            <div className="flex-1 w-full space-y-16">
              {/* Category Hero */}
              <div className="relative rounded-[2.5rem] border border-emerald-100 bg-[#f9fdfa] p-10 md:p-12 overflow-hidden flex flex-col lg:flex-row items-center gap-10 shadow-sm">
                <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left">
                  <div className="space-y-4">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#1a4d2e] leading-tight capitalize">
                      {categoryName} <br />
                      <span className="text-emerald-600 opacity-80">Collection</span>
                    </h1>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    {["Structural Integrity Certified", "High-Fidelity Printing Architecture", "Industrial-Grade Durability", "GOTS Sustainable Sourcing"].map((f) => (
                      <div key={f} className="flex items-center gap-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                        <div className="h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative w-full lg:w-[350px] aspect-square flex items-center justify-center">
                   <div className="absolute inset-0 bg-emerald-500/5 blur-[80px] rounded-full" />
                   <Image key={heroImage} src={heroImage} alt={categoryName} fill className="object-contain drop-shadow-2xl z-10 transition-transform duration-700 hover:scale-105 p-6" />
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-100 pb-8 gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Sort:</span>
                    <select 
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value)}
                      className="bg-transparent text-[10px] font-black text-black outline-none cursor-pointer uppercase tracking-widest"
                    >
                      <option>Featured Index</option>
                      <option>Price Ascending</option>
                      <option>Price Descending</option>
                    </select>
                  </div>
                  <div className="h-4 w-px bg-zinc-100" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{sortedProducts.length} Units Logged</span>
                </div>
                <div className="flex items-center gap-4">
                  <LayoutGrid 
                    onClick={() => setViewMode("grid")}
                    className={`h-4 w-4 cursor-pointer transition-colors ${viewMode === "grid" ? "text-emerald-600" : "text-zinc-300 hover:text-black"}`} 
                  />
                  <List 
                    onClick={() => setViewMode("list")}
                    className={`h-4 w-4 cursor-pointer transition-colors ${viewMode === "list" ? "text-emerald-600" : "text-zinc-300 hover:text-black"}`} 
                  />
                </div>
              </div>

              {/* Product Grid/List */}
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12" : "flex flex-col gap-6"}>
                {isLoading ? (
                  [...Array(6)].map((_, i) => <div key={i} className="aspect-square rounded-2xl bg-zinc-50 animate-pulse border border-zinc-100" />)
                ) : (
                  sortedProducts.map((p) => <ProductCard key={p.id} product={p} viewMode={viewMode} />)
                )}
              </div>

              {/* Bespoke Custom Design CTA Banner - NEW */}
              <div className="relative rounded-[3rem] border border-zinc-100 bg-white p-12 overflow-hidden flex flex-col md:flex-row items-center gap-12 shadow-sm">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#f9fdfa,_transparent)] opacity-50" />
                <div className="relative z-10 w-full md:w-1/2 flex justify-center">
                   <div className="relative w-full aspect-video md:aspect-square">
                     <Image 
                      src="/images/custom-design.png" 
                      alt="Custom Design" 
                      fill 
                      className="object-contain drop-shadow-2xl" 
                    />
                   </div>
                </div>
                <div className="relative z-10 w-full md:w-1/2 text-center md:text-left space-y-6">
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black leading-tight">Design A Custom Tote Bag <br/><span className="text-emerald-600">For Your Brand!</span></h2>
                  <p className="text-sm font-black uppercase tracking-widest text-zinc-400">Can&apos;t seem to find the design you&apos;re looking for?</p>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-[#1a4d2e]">Let Us Help!</h3>
                    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed max-w-sm">
                      Get a fully customized tote bag tailored for your brand. Just send us the design, cut, color requirements, or an image, and we&apos;ll create a personalized tote bag for you!
                    </p>
                  </div>
                  
                  <Link href="/design-your-bag" className="inline-block pt-4">
                    <Button className="h-14 px-10 rounded-full bg-[#1a4d2e] text-white font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl">
                      Send Your Requirements Now
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Archive Intelligence / FAQ */}
              <div className="pt-20 border-t border-zinc-100">
                <h2 className="text-2xl font-black text-black tracking-tighter uppercase mb-10">Archive <span className="italic font-serif text-zinc-400 normal-case tracking-normal">Intelligence</span></h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
                   {FAQ_DATA.map((faq, i) => <FAQItem key={i} question={faq.q} answer={faq.a} />)}
                </div>
              </div>

              {/* System Endorsements / Reviews */}
              <div className="pt-20 border-t border-zinc-100">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <h2 className="text-2xl font-black text-black uppercase tracking-tighter">System <br/><span className="italic font-serif text-zinc-400 normal-case tracking-normal">Endorsements</span></h2>
                  <div className="flex items-center gap-4 bg-zinc-50 px-6 py-3 rounded-full border border-zinc-100">
                    <span className="text-2xl font-black text-black tracking-tighter">4.92</span>
                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Lora Eahl", text: "Structural integrity is exceptional. The carrier systems are perfectly aligned with our identity." },
                    { name: "Tim James", text: "Best-in-class architectural carrier solutions. The minimalist aesthetic is unmatched." },
                    { name: "Rob Liam", text: "Professional-grade logistics and high-fidelity material quality. A vital retail asset." }
                  ].map((t, idx) => (
                    <Card key={idx} className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100 shadow-sm">
                      <CardContent className="p-0">
                        <p className="text-[11px] text-zinc-500 leading-relaxed mb-8 italic font-medium">&quot;{t.text}&quot;</p>
                        <div className="pt-6 border-t border-zinc-200/50 flex items-center justify-between">
                          <h4 className="text-[9px] font-black text-black uppercase tracking-widest">{t.name}</h4>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Informative Context Section - NEW */}
              <div className="pt-24 border-t border-zinc-100">
                <div className="max-w-5xl space-y-8 text-[11px] font-black leading-[2] text-zinc-400 uppercase tracking-[0.2em] text-center md:text-left">
                  <p>The right {categoryName} architectures are an essential component of retail infrastructure. We prioritize structural integrity, ensuring every {categoryName} carrier acts as a premium touchpoint for your brand identity. By transitioning from traditional materials to GOTS-certified non-woven systems, brands mitigate environmental impact while enhancing the tactile experience of their physical fulfillment. Our {categoryName} series is stress-tested to exceed industry benchmarks for durability and aesthetic longevity.</p>
                  <p>Our commitment to architectural excellence means that every bag is engineered to perform. From the reinforced handles of our {categoryName} series to the precision-cut silhouettes, we ensure that your brand is represented by the highest standard of non-woven technology available in the global market today.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <BestSellers />
      <Footer />
    </main>
  );
}
