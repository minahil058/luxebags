"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Package } from "lucide-react";
import { getSmartSrc } from "@/lib/utils";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const [imageError, setImageError] = React.useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const finalSrc = getSmartSrc(product.image_url);

  return (
    <div 
      onClick={(e) => {
        if (product.stock_quantity !== undefined && product.stock_quantity <= 0) {
          e.preventDefault();
          return;
        }
        router.push(`/product/${product.id}`);
      }} 
      className={`block group ${product.stock_quantity !== undefined && product.stock_quantity <= 0 ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col gap-6"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50/50 backdrop-blur-sm transition-all duration-500 group-hover:border-emerald-500/20 group-hover:bg-white p-6 flex items-center justify-center">
          {!imageError && finalSrc ? (
            <Image
              src={finalSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              className="object-contain p-4 transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-800/80 text-zinc-500 gap-3 border border-dashed border-zinc-700/50 rounded-[2.5rem]">
              <Package className="w-12 h-12 opacity-20" />
              <span className="relative z-10 text-[7px] font-black uppercase tracking-[0.2em] opacity-40">Asset Recovery</span>
            </div>
          )}
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          {product.stock_quantity !== undefined && product.stock_quantity <= 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
               <div className="bg-black text-white px-3 py-1.5 border border-zinc-800 rounded-lg text-[7px] font-black uppercase tracking-[0.2em] shadow-xl">
                  Archived / Sold Out
               </div>
            </div>
          )}

          {!(product.stock_quantity !== undefined && product.stock_quantity <= 0) && (
            <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="h-8 w-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center shadow-lg">
                <Plus className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center text-center gap-2 px-2">
          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-0.5">{product.category}</span>
          <h3 className="text-[11px] font-black tracking-tight text-zinc-900 group-hover:text-emerald-600 transition-colors uppercase leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-black text-zinc-900 tracking-tighter">
              {typeof product.price === 'number' ? `$${Number(product.price).toFixed(2)}` : (String(product.price).includes('$') ? product.price : `$${product.price}`)}
            </span>
            <span className="text-[8px] text-zinc-300 line-through font-bold">$15.00</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
