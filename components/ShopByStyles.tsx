"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getSmartSrc } from "@/lib/utils";

const styles = [
  {
    name: "D-Cut Tote Bag",
    image: "/images/style-1.jpeg",
    desc: "Elegant and simple design for retail and boutiques."
  },
  {
    name: "Handled Tote Bag",
    image: "/images/style-2.jpeg",
    desc: "Reinforced handles for grocery and shopping needs."
  },
  {
    name: "Squared Tote Bag",
    image: "/images/style-3.jpeg",
    desc: "High volume capacity for industrial storage."
  },
  {
    name: "Bottom Gusset Bag",
    image: "/images/style-4.jpeg",
    desc: "Stands upright for premium product displays."
  },
  {
    name: "Shopping Bag",
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop",
    desc: "Versatile and durable carrier for daily retail use."
  },
];

export const ShopByStyles = () => {
  return (
    <section id="styles" className="relative bg-white py-16 overflow-hidden border-t border-zinc-100">
      <div className="container relative z-10 mx-auto px-6 max-w-5xl">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black tracking-tighter text-black uppercase"
          >
            Shop By <span className="italic font-serif text-zinc-400 normal-case tracking-normal">Styles</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-zinc-400 text-[9px] font-black uppercase tracking-[0.3em]"
          >
            Variations Ranging From 70 - 100 GSM
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {styles.map((style) => (
            <Link key={style.name} href={`/category/${encodeURIComponent(style.name)}`}>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                className="group relative flex flex-col items-center rounded-[2rem] border border-zinc-100 bg-zinc-50 transition-all duration-700 hover:border-emerald-200 hover:bg-white shadow-sm hover:shadow-2xl cursor-pointer pt-6 px-6 pb-8 gap-3 overflow-hidden"
              >
                {/* Product Info Header */}
                <div className="relative z-20 text-center w-full">
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1 block opacity-0 group-hover:opacity-100 transition-all">Selection Style</span>
                  <h3 className="text-sm font-black tracking-[0.15em] text-zinc-900 group-hover:text-black transition-colors uppercase">
                    {style.name}
                  </h3>
                </div>

                {/* Card Body - Scaled Down */}
                <div className="relative aspect-[2/1] w-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.03)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={getSmartSrc(style.image)}
                      alt={style.name}
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </motion.div>
                </div>

                {/* Bottom Decoration */}
                <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-500 w-full flex justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-[1px] bg-emerald-500" />
                    <span className="text-[6px] font-black uppercase tracking-[0.2em] text-zinc-400">Premium Finish</span>
                    <div className="w-6 h-[1px] bg-emerald-500" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
