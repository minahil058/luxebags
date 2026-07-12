"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSmartSrc } from "@/lib/utils";
import { useProductStore } from "@/store/useProductStore";

const MagneticButton = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.4);
    y.set((clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
    >
      {children}
    </motion.div>
  );
};

export const ShopByUsage = () => {
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const usageProducts = products.filter((p) => p.type === "usage");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="usage" className="relative bg-white py-12 overflow-hidden">
      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="mb-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black tracking-tighter text-black uppercase"
          >
            Shop By <span className="italic font-serif text-zinc-400 normal-case tracking-normal">Usage</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-3 h-1 w-12 bg-emerald-500 mx-auto rounded-full"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 max-w-5xl mx-auto"
        >
          {isLoading && usageProducts.length === 0 ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square rounded-[1.5rem] bg-zinc-50 animate-pulse" />
            ))
          ) : (
            usageProducts.map((category) => (
              <Link
                key={category.id}
                href={`/category/${encodeURIComponent(category.category)}`}
                className="block"
              >
                <motion.div
                  variants={itemVariants}
                  className="group relative flex flex-col items-center"
                >
                  {/* Card Container - Smaller & Compact */}
                  <div className="relative w-full aspect-square rounded-[1.5rem] bg-zinc-50 border border-zinc-100 p-4 overflow-hidden transition-all duration-700 group-hover:border-emerald-200 group-hover:bg-white shadow-sm group-hover:shadow-xl group-hover:-translate-y-1">
                    <div className="relative h-full w-full flex flex-col items-center justify-center">
                      <Image
                        src={getSmartSrc(category.image_url)}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Text Label */}
                  <div className="mt-4 flex flex-col items-center gap-1">
                    <h3 className="text-center text-[8px] font-black tracking-[0.25em] text-zinc-400 group-hover:text-black transition-colors uppercase">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <MagneticButton>
            <Link href="/shop-all">
              <Button variant="outline" className="h-12 px-8 rounded-full border-zinc-200 bg-white text-black text-[8px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all group overflow-hidden shadow-sm">
                <span className="relative z-10 flex items-center gap-3">
                  View All Categories
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};
