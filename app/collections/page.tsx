"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Leaf, Truck, ChevronRight, Award, Zap, Globe, Package, 
  ArrowRight, Mail, PencilRuler, Eye, Rocket, CheckCircle2, Star, Quote,
  Maximize2, Binary
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/store/useProductStore";
import { getSmartSrc } from "@/lib/utils";

// Verified High-Reliability BAG ONLY Image IDs
const COLLECTIONS = [
  {
    id: "luxury-main",
    name: "Luxury Series",
    category: "Luxury",
    image: "/images/sell-1.jpeg",
    description: "Handcrafted signature pieces.",
    tags: ["Best Sellers"]
  },
  {
    id: "retail",
    name: "Retail Essentials",
    category: "Retail",
    image: "/images/sell-2.jpeg",
    description: "Premium shopping totes.",
    tags: ["New Arrivals"]
  },
  {
    id: "industrial",
    name: "Industrial Heavy",
    category: "Industrial",
    image: "/images/sell-4.jpeg",
    description: "Heavy-duty carry solutions.",
    tags: ["Best Sellers"]
  },
  {
    id: "luxury-events",
    name: "Event Luxe",
    category: "Events",
    image: "/images/sell-3.jpeg",
    description: "Elegant gifting carrie$",
    tags: ["New Arrivals"]
  },
  {
    id: "eco",
    name: "Eco-Daily",
    category: "Eco",
    image: "/images/feature-2.jpeg",
    description: "100% biodegradable carry.",
    tags: ["Sustainable"]
  },
  {
    id: "custom",
    name: "Custom Series",
    category: "Custom",
    image: "/images/feature-4.jpeg",
    description: "Bespoke branding series.",
    tags: ["New Arrivals"]
  },
  {
    id: "style-1",
    name: "Minimalist Totes",
    category: "Style",
    image: "/images/sell-5.jpeg",
    description: "Modern shopper aesthetic.",
    tags: ["New Arrivals"]
  },
  {
    id: "style-2",
    name: "Canvas Premium",
    category: "Style",
    image: "/images/feature-1.jpeg",
    description: "High-grade canvas durability.",
    tags: ["Best Sellers"]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function CollectionsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredCollections = activeFilter === "All" 
    ? COLLECTIONS 
    : activeFilter === "Best Sellers"
      ? products.filter(p => p.bestseller || p.type === 'best_seller').map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image_url,
          tags: ["Best Sellers"],
          isProduct: true
        }))
      : activeFilter === "New Arrivals"
        ? products.slice(0, 8).map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            image: p.image_url,
            tags: ["New Arrivals"],
            isProduct: true
          }))
        : activeFilter === "Sustainable"
          ? products.filter(p => p.category.toLowerCase().includes('eco') || p.category.toLowerCase().includes('sustainable')).map(p => ({
              id: p.id,
              name: p.name,
              category: p.category,
              image: p.image_url,
              tags: ["Sustainable"],
              isProduct: true
            }))
          : COLLECTIONS.filter(c => c.tags.includes(activeFilter));


  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      <Navbar />
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-16 px-6 bg-zinc-50 border-b border-zinc-100 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#ecfdf5_0%,_transparent_70%)]" />
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-4 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200">
               <Zap className="w-3 h-3 text-emerald-600" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-700">Protocol 2.0</span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black tracking-tighter uppercase text-black leading-none">
              Collections <br />
              <span className="text-emerald-600 italic font-serif normal-case tracking-normal">Archive</span>
            </h1>
          </motion.div>
          <div className="flex items-center gap-12 opacity-30">
             {["Adobe", "HP", "Ladurée", "Brand", "Core"].map((b, i) => (
               <motion.span 
                 key={b} 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="text-[10px] font-black uppercase tracking-[0.5em]"
               >
                 {b}
               </motion.span>
             ))}
          </div>
        </div>
      </section>

      {/* 2. Global Endorsements Trust Row */}
      <section className="py-8 bg-white border-b border-zinc-100">
         <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
               {[
                 { t: "Eco Certified 2024", i: Leaf },
                 { t: "Global Logistics Tier-1", i: Globe },
                 { t: "ISO Structural Standard", i: ShieldCheck },
                 { t: "Verified Brand Partner", i: CheckCircle2 }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-2">
                    <item.i className="w-4 h-4 text-emerald-600" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{item.t}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 3. Strategic Roadmap */}
      <section className="py-12 border-b border-zinc-50 bg-zinc-50/50">
         <div className="container mx-auto px-6 max-w-6xl">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
               {[
                 { t: "Blueprint Design", d: "Conceptualize brand architecture.", i: PencilRuler },
                 { t: "Asset Verification", d: "Fidelity testing.", i: Eye },
                 { t: "Global Deployment", d: "Final fulfillment.", i: Rocket }
               ].map((step, i) => (
                 <motion.div key={i} variants={itemVariants} className="flex gap-5 items-start group">
                    <div className="h-12 w-12 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shrink-0 group-hover:border-emerald-500 transition-all shadow-sm">
                       <step.i className="w-5 h-5 text-emerald-600 transition-transform group-hover:scale-110" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-black">Step {i+1}: {step.t}</h4>
                       <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">{step.d}</p>
                    </div>
                 </motion.div>
               ))}
            </motion.div>
         </div>
      </section>

      {/* 4. Filter Bar */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-3xl border-b border-zinc-100 py-5">
        <div className="container mx-auto px-6 max-w-6xl flex items-center justify-center gap-10">
            {["All", "New Arrivals", "Best Sellers", "Sustainable"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`relative text-[9px] font-black uppercase tracking-[0.2em] transition-all py-1 ${
                  activeFilter === cat ? "text-emerald-600" : "text-zinc-400 hover:text-black"
                }`}
              >
                {cat}
                {activeFilter === cat && (
                  <motion.div 
                    layoutId="filterBar" 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" 
                  />
                )}
              </button>
            ))}
        </div>
      </div>

      {/* 5. Grid Section - BAG ONLY PRODUCTS */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredCollections.map((collection: any, idx) => (
                <motion.div
                  key={collection.id}
                  layout
                  variants={itemVariants}
                  className="group"
                >
                  <Link href={collection.isProduct ? `/product/${collection.id}` : `/category/${encodeURIComponent(collection.category)}`}>
                    <div className="relative aspect-[3/4] rounded-[1.8rem] overflow-hidden bg-zinc-50 border border-zinc-100 transition-all duration-700 group-hover:border-emerald-500/30 group-hover:shadow-xl">
                      <Image
                        src={getSmartSrc(collection.image)}
                        alt={collection.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        unoptimized={true}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-60" />
                      
                      <div className="absolute inset-x-0 bottom-0 p-6 space-y-2">
                        <span className="text-[7px] font-black uppercase tracking-widest text-emerald-600 px-3 py-1 bg-white rounded-full shadow-sm">
                          {collection.category}
                        </span>
                        <h3 className="text-sm font-black text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors leading-none">
                          {collection.name}
                        </h3>
                      </div>
                      <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md text-emerald-600 flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
                         <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 6. Material Precision Gallery - BAG TEXTURES ONLY */}
      <section className="py-16 px-6 bg-zinc-50 border-y border-zinc-100 overflow-hidden">
         <div className="container mx-auto max-w-6xl space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-sm font-black uppercase tracking-widest">Material Precision Gallery</h2>
               <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest">Architectural Texture Archive</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400&q=80",
                 "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
                 "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&q=80",
                 "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&q=80"
               ].map((src, i) => (
                 <motion.div 
                   key={i} 
                   whileHover={{ scale: 1.05 }}
                   className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 grayscale hover:grayscale-0 transition-all duration-700"
                 >
                    <Image src={src} alt="Bag Texture" fill className="object-cover" unoptimized={true} />
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. Structural Blueprint Breakdown - REFINED BAG ONLY */}
      <section className="py-20 px-6 bg-white overflow-hidden border-b border-zinc-100">
         <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
               <div className="space-y-10">
                  <div className="space-y-4">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                        <Binary className="w-3 h-3 text-emerald-600" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-700">Tech Archive 01</span>
                     </div>
                     <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Structural <br /> Blueprint</h2>
                     <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] max-w-sm leading-relaxed">
                        Precision engineering for maximum durability and brand fidelity.
                     </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                     {[
                       { t: "Signature Shell", d: "High-density polymer weave." },
                       { t: "Fidelity Layer", d: "4K architectural ink system." },
                       { t: "Ultrasonic Seams", d: "Reinforced heat-sealed points." }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-emerald-500/20 transition-all group max-w-md">
                          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                             <Award className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5">
                             <h4 className="text-[9px] font-black uppercase tracking-widest">{item.t}</h4>
                             <p className="text-[8px] text-zinc-400 font-medium uppercase">{item.d}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               
               <div className="relative group">
                  <div className="relative grid grid-cols-2 gap-4 max-w-lg ml-auto">
                     <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-zinc-100 shadow-xl">
                        <Image 
                          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80" 
                          alt="Bag Structural Detail" 
                          fill 
                          className="object-cover"
                          unoptimized={true}
                        />
                     </div>
                     <div className="space-y-4 pt-12">
                        <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-100 shadow-lg">
                           <Image 
                             src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&q=80"
                             alt="Bag Close-up" 
                             fill 
                             className="object-cover"
                             unoptimized={true}
                           />
                        </div>
                        <div className="p-6 bg-zinc-900 rounded-2xl text-white space-y-3 shadow-2xl">
                           <Maximize2 className="w-5 h-5 text-emerald-500" />
                           <h5 className="text-[9px] font-black uppercase tracking-widest">Architectural Depth</h5>
                           <p className="text-[8px] text-zinc-500 font-bold uppercase leading-tight">Verified for 15KG+ load integrity.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 8. Client Archives (Testimonials) */}
      <section className="py-20 bg-zinc-900 text-white overflow-hidden">
         <div className="container mx-auto px-6 max-w-6xl text-center space-y-12">
            <div className="space-y-2">
               <Quote className="w-8 h-8 text-emerald-500 mx-auto opacity-50" />
               <h2 className="text-xl font-black uppercase tracking-tighter">Client Archives</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { n: "Boutique Paris", c: "Exceeded structural expectations." },
                 { n: "Global Retail Co", c: "The new standard in brand carry." },
                 { n: "Identity Studio", c: "Architectural precision at scale." }
               ].map((item, i) => (
                 <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all space-y-4">
                    <div className="flex justify-center gap-1">
                       {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-emerald-500 text-emerald-500" />)}
                    </div>
                    <p className="text-[11px] font-medium italic text-zinc-400 uppercase tracking-tight leading-relaxed">&quot;{item.c}&quot;</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500">— {item.n}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 9. Join The Inner Circle */}
      <section className="py-20 px-6 bg-zinc-50 border-t border-zinc-100">
         <div className="container mx-auto max-w-2xl text-center space-y-8">
            <div className="space-y-2">
               <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">Join The Inner Circle</h2>
               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Updates exclusively to your hub.</p>
            </div>
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
                const button = e.currentTarget.querySelector("button");
                if (button) button.disabled = true;
                
                try {
                  const { subscribeToNewsletter } = await import("@/app/actions");
                  const result = await subscribeToNewsletter(email);
                  if (result.success) {
                    alert("PROTOCOL SUCCESS: Identity verified. You are now part of the Inner Circle.");
                    (e.target as HTMLFormElement).reset();
                  } else {
                    alert("SYNC ERROR: " + result.error);
                  }
                } catch (err) {
                  alert("COMMUNICATION ERROR: Please verify your connection protocol.");
                } finally {
                  if (button) button.disabled = false;
                }
              }}
              className="flex gap-3 max-sm:flex-col max-w-md mx-auto"
            >
               <Input 
                 name="email"
                 type="email"
                 required
                 placeholder="IDENTITY@DOMAIN.COM" 
                 className="h-12 bg-white border-zinc-200 rounded-xl px-6 text-[10px] font-black tracking-widest focus-visible:ring-emerald-500 uppercase shadow-sm"
               />
               <Button type="submit" className="h-12 px-8 rounded-xl bg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-md active:scale-95">
                 Join
               </Button>
            </form>
            <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">We respect your data privacy protocol.</p>
         </div>
      </section>

      <Footer />
    </main>
  );
}
