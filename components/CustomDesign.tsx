"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BackgroundTexture } from "./BackgroundTexture";
import { ArrowRight } from "lucide-react";
import { RequestModal } from "./RequestModal";

export const CustomDesign = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <section className="relative bg-black py-16 overflow-hidden border-t border-white/5">
      <BackgroundTexture />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-3xl font-black tracking-tighter text-white uppercase"
          >
            DESIGN A CUSTOM TOTE BAG <br />
            <span className="text-[#22c55e]">FOR YOUR BRAND!</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-zinc-500 text-sm md:text-base font-medium"
          >
            Can&apos;t seem to find the design you&apos;re looking for?
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onMouseMove={handleMouseMove}
          className="relative group grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 md:p-10 rounded-[3rem] border border-white/10 bg-white/[0.04] backdrop-blur-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto"
        >
          {/* Spotlight Effect */}
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
            style={{
              background: `radial-gradient(400px circle at ${springX}px ${springY}px, rgba(34,197,94,0.08), transparent 40%)`,
            }}
          />

          {/* Left Column: Image - Scaled Down */}
          <div className="relative z-10 flex justify-center order-2 lg:order-1">
            <motion.div
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative w-full aspect-square max-w-[280px] mx-auto"
            >
              <Image
                src="/images/custom-design.png"
                alt="Design Your Custom Bag"
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-contain drop-shadow-2xl transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-emerald-500/5 blur-[60px] rounded-full" />
            </motion.div>
          </div>

          {/* Right Column: Content */}
          <div className="relative z-10 flex flex-col gap-4 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl md:text-4xl font-black text-white leading-tight mb-2">
                Let Us Help!
              </h3>
              <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-md mb-6 font-medium">
                Get a fully <span className="text-white font-bold underline decoration-[#22c55e] decoration-2 underline-offset-4">customized tote bag</span> tailored for your brand. Just send us the design, cut, and color requirements.
              </p>

              <Button
                onClick={() => setIsModalOpen(true)}
                className="h-14 px-8 rounded-full bg-[#22c55e] text-black font-black text-[11px] uppercase tracking-widest hover:bg-[#16a34a] transition-all shadow-xl group active:scale-95"
              >
                Send Requirements Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="custom"
        title="Custom Bag Design Inquiry"
      />
    </section>
  );
};
