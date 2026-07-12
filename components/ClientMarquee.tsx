"use client";

import React from "react";
import { motion } from "framer-motion";

const clients = [
  { name: "foodpanda" },
  { name: "STYLO" },
  { name: "Khaadi" },
  { name: "BONANZA SATRANGI" },
  { name: "WALKEAZE" },
  { name: "SUAAD" },
];

// Double the array for seamless looping
const marqueeClients = [...clients, ...clients];

export const ClientMarquee = () => {
  return (
    <section className="py-20 bg-[#f8fafc] overflow-hidden border-t border-zinc-100">
      <div className="container mx-auto px-4 mb-12 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl lg:text-4xl"
        >
          Trusted By 500+ Clients Worldwide
        </motion.h2>
      </div>

      <div className="relative flex overflow-hidden">
        {/* Gradient Mask for fading edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#f8fafc] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#f8fafc] to-transparent z-10" />

        <motion.div 
          animate={{ x: [0, -1035] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex gap-16 md:gap-24 items-center whitespace-nowrap px-8"
        >
          {marqueeClients.map((client, idx) => (
            <div 
              key={idx}
              className="group flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer"
            >
              <span className="text-2xl md:text-4xl font-black tracking-tighter text-zinc-400 group-hover:text-zinc-900 transition-colors uppercase">
                {client.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
