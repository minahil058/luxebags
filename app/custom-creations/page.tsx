"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { getSmartSrc } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

// Pre-mapped original gallery files restored directly from local public directory
const STATIC_CUSTOM_GALLERY = [
  { id: "sc-1", src: "/images/custom-1.webp", alt: "Bethesda Detailers Print Tote" },
  { id: "sc-2", src: "/images/custom-2.webp", alt: "Cyan Side Seam Detail View" },
  { id: "sc-3", src: "/images/custom-3.webp", alt: "Handle Stitch Detail Layout" },
  { id: "sc-4", src: "/images/custom-4.jpg", alt: "Loose Items Gathering Message Print" },
  { id: "sc-5", src: "/images/custom-5.webp", alt: "TRU Hair styles Manifest Packaging" },
  { id: "sc-6", src: "/images/custom-6.webp", alt: "Bottom Gusset Non Woven Tote" },
  { id: "sc-7", src: "/images/custom-7.jpg", alt: "Screen Printed Clean Surface" },
  { id: "sc-8", src: "/images/custom-8.jpg", alt: "Double Side Corporate Logo" },
  { id: "sc-9", src: "/images/custom-9.webp", alt: "Bulk Wholesale Custom Supply" }
];

export default function CustomCreationsPage() {
  const [dbItems, setDbItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or('category.ilike.%custom%,name.ilike.%custom%');
          
        if (!error && data && data.length > 0) {
          setDbItems(data);
        }
      } catch (err) {
        console.error("Error syncing custom products from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomProducts();
  }, []);

  // Combine static disk files perfectly with matching database inventory array
  const combinedItems = [
    ...STATIC_CUSTOM_GALLERY,
    ...dbItems.map((item, idx) => ({
      id: `db-${item.id || idx}`,
      src: item.image_url || "/images/custom-1.webp",
      alt: item.name || "Custom Non Woven creation"
    }))
  ];

  return (
    <main className="min-h-screen bg-white text-black font-sans antialiased selection:bg-emerald-600 selection:text-white">
      <Navbar />

      <div className="pt-28 pb-20">
        {/* Core Content Container */}
        <div className="container mx-auto px-6 max-w-7xl space-y-12">
          
          {/* 1. Exact Screen Shot Matched Hero Box */}
          <div className="bg-[#f8f9fa] rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 border border-zinc-100/80 shadow-sm overflow-hidden relative">
             <div className="space-y-3 max-w-lg z-10 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#1a4d2e]">
                   Custom Creations
                </h1>
                <p className="text-xl md:text-3xl font-medium tracking-tight text-zinc-800 leading-snug">
                   With Custom Printed <br />
                   Non Woven Tote Bags
                </p>
             </div>

             {/* Side Grouped Bag Layered Asset */}
             <div className="relative w-full md:w-[480px] aspect-[16/10] shrink-0 flex items-center justify-center">
                <Image 
                  src={getSmartSrc("/images/custom-design.png")} 
                  alt="Custom Layered Non Woven Bags Demo" 
                  fill 
                  className="object-contain drop-shadow-xl"
                  priority
                  unoptimized={true}
                />
             </div>
          </div>

          {/* 2. Responsive Multi-Column Full Bleed Masonry Gallery */}
          {loading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Database References...</span>
             </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {combinedItems.map((item) => (
                   <Link 
                     key={item.id} 
                     href="/design-your-bag"
                     className="group block relative overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-100/60 shadow-sm hover:shadow-xl transition-all duration-500"
                   >
                      {/* Maintain pure original layout scaling */}
                      <div className="relative w-full aspect-square md:aspect-[4/5]">
                         <Image 
                           src={getSmartSrc(item.src)} 
                           alt={item.alt} 
                           fill 
                           className="object-cover transition-transform duration-700 group-hover:scale-105"
                           sizes="(max-width: 768px) 100vw, 33vw"
                           unoptimized={true}
                         />
                      </div>

                      {/* Subtle hover prompt overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-white truncate max-w-[200px]">
                            {item.alt}
                         </span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-white/10 backdrop-blur px-2.5 py-1 rounded">
                            Order Similar
                         </span>
                      </div>
                   </Link>
                ))}
             </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  );
}
