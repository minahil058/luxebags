"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSmartSrc } from "@/lib/utils";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";

export const BestSellers = () => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const sellerProducts = products.length > 0
    ? products.filter((p) => p.bestseller === true || p.type === "best_seller")
    : [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75; // Move 75% of view
      const target = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: target,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-white py-16 border-t border-zinc-100 relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-6">
        {/* Header with Navigation - Matches Screenshot */}
        <div className="mb-8 flex items-center justify-between border-b border-zinc-100 pb-6">
          <Link href="/collections/bestsellers" className="group flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 uppercase group-hover:text-emerald-600 transition-colors">Bestsellers</h2>
            <div className="h-1 w-8 bg-zinc-100 group-hover:w-16 group-hover:bg-emerald-500 transition-all duration-500" />
          </Link>
          <div className="flex items-center">
            <Link href="/collections/bestsellers">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="h-12 w-12 bg-zinc-900 text-white hover:bg-black transition-all rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl group"
              >
                <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading && sellerProducts.length === 0 ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="min-w-[220px] aspect-square rounded-xl bg-zinc-50 animate-pulse" />
            ))
          ) : (
            sellerProducts.map((product, idx) => (
              <Link 
                key={product.id}
                href={`/product/${product.id}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="group min-w-[220px] flex flex-col rounded-xl border border-zinc-100 bg-white overflow-hidden transition-all duration-300 hover:border-zinc-300 hover:shadow-xl cursor-pointer p-4 h-full"
                >
                  {/* Visual Container */}
                  <div className="relative aspect-square w-full mb-4 bg-zinc-50 rounded-lg overflow-hidden flex items-center justify-center p-4">
                    <Image
                      src={getSmartSrc(product.image_url)}
                      alt={product.name}
                      fill
                      sizes="200px"
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                      unoptimized={true}
                    />
                  </div>

                  {/* Info Container */}
                  <div className="text-center space-y-1">
                    <h3 className="text-[9px] font-black leading-tight tracking-[0.1em] text-zinc-900 group-hover:text-emerald-600 transition-colors uppercase h-6 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-[10px] font-black text-zinc-900 tracking-tighter">
                      {product.price}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
