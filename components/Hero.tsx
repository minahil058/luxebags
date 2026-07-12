"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { RequestModal } from "./RequestModal";
import { getSmartSrc } from "@/lib/utils";

export const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative flex h-screen items-center overflow-hidden bg-black">
      {/* Integrated Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getSmartSrc("/images/hero-bg.png")}
          alt="Premium Eco-Friendly Tote Bags"
          fill
          sizes="100vw"
          className="object-cover object-[85%_center] md:object-right opacity-85 transition-transform duration-1000"
          priority
          unoptimized={true}
        />
        {/* Advanced Gradient Masking for Seamless Integration */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30" />
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[8px] font-black tracking-[0.4em] text-zinc-500 uppercase"
          >
            Sustainable Manufacturing
          </motion.span>
          
          <h1 className="mb-6 text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.95] uppercase">
            Sustainable <br />
            <span className="text-zinc-600 italic font-serif normal-case tracking-normal opacity-80">Sophistication</span>
          </h1>
          
          <p className="mb-10 max-w-lg text-sm md:text-base text-zinc-500 leading-relaxed font-medium tracking-tight">
            Premium non-woven tote bags meticulously crafted for global brands. 
            Merging industrial-grade durability with a minimalist aesthetic.
          </p>
          
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <Link href="/shop-all" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-12 px-8 rounded-full bg-white text-black font-black hover:bg-emerald-500 transition-all text-[10px] uppercase tracking-widest shadow-xl">
                Explore Collection
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto h-12 px-8 rounded-full border-white/10 bg-white/5 backdrop-blur-xl text-white font-black hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest"
            >
              Request a Quote
            </Button>
          </div>
        </motion.div>
      </div>

      <RequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="quote"
        title="Request a Custom Quote"
      />


      {/* Subtle Scroll Indicator - Compact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-6 md:left-12"
      >
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-10 bg-gradient-to-r from-emerald-500 to-transparent" />
          <span className="text-[8px] uppercase tracking-[0.5em] text-zinc-700 font-black">Discover</span>
        </div>
      </motion.div>
    </section>
  );
};
