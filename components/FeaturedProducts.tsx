"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BackgroundTexture } from "./BackgroundTexture";
import { getSmartSrc } from "@/lib/utils";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";

export const FeaturedProducts = () => {
  const router = useRouter();
  const { products, isLoading } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);

  const featured = products.filter(p => p.featured === true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative bg-black py-16 overflow-hidden border-t border-white/5">
      <BackgroundTexture />

      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-6">
          <h2 className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase">Featured Discovery</h2>
          <div className="flex items-center gap-3">
            <Link href="/featured">
              <Button
                variant="outline"
                className="h-9 px-6 rounded-full border-white/10 bg-zinc-900/50 backdrop-blur-md text-white hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all text-[9px] font-black uppercase tracking-widest gap-2"
              >
                View More <Plus className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 5-Column Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5"
        >
          {isLoading && featured.length === 0 ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
            ))
          ) : (
            featured.map((product) => (
              <Link key={product.id} href="/featured">
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -5 }}
                  className="group flex flex-col rounded-[2rem] border border-zinc-900 bg-zinc-900/20 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:shadow-2xl cursor-pointer h-full shadow-lg"
                >
                  {/* Product Visual */}
                  <div className="relative aspect-square w-full overflow-hidden p-5 flex items-center justify-center">
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.03)_0%,_transparent_70%)]"
                    />

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="relative h-full w-full"
                    >
                      <Image
                        src={getSmartSrc(product.image_url)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-contain drop-shadow-xl"
                      />
                    </motion.div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-grow p-3 text-center border-t border-white/5">
                    <h3 className="text-[9px] font-black leading-relaxed tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors line-clamp-2 mb-2 h-8 uppercase">
                      {product.name}
                    </h3>
                    <p className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">
                      {product.price}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};
