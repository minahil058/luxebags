"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BackgroundTexture } from "./BackgroundTexture";
import { RequestModal } from "./RequestModal";

export const RequestSample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative bg-[#020202] py-12 overflow-hidden border-t border-white/5">
      <BackgroundTexture />
      
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[400px] md:h-[450px] w-full rounded-[3rem] border border-white/5 bg-[#050505] overflow-hidden shadow-2xl"
        >
          {/* Left Side: Content */}
          <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12 z-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
                Want to Assess Our High-Quality Products? <br />
                <span className="text-[#22c55e]">Request a Product Sample Now!</span>
              </h2>
              <p className="text-zinc-400 text-base md:text-lg mb-6 max-w-lg leading-relaxed">
                Contact us to avail this exclusive option and see the quality for yourself.
              </p>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="h-14 px-10 rounded-full bg-[#22c55e] text-black font-bold text-base hover:bg-[#16a34a] transition-all shadow-[0_0_30px_rgba(34,197,94,0.2)]"
              >
                Contact Us
              </Button>
            </motion.div>
          </div>

          {/* Right Side: Image with Mask */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative h-full w-full min-h-[300px] lg:min-h-full"
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent lg:block hidden" />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-transparent lg:hidden block" />
            
            <Image
              src="/images/sample-bags.png"
              alt="Request a Sample"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 50vw"
              className="object-cover lg:object-right"
              priority
            />
          </motion.div>
        </motion.div>
      </div>

      <RequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="sample"
        title="Request a Sample Pack"
      />
    </section>
  );
};
