"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Headphones, 
  RotateCcw, 
  Eye, 
  BadgeDollarSign, 
  Zap, 
  CreditCard,
  FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

const trustFeatures = [
  {
    icon: <Headphones className="h-6 w-6 text-[#1a4d2e]" />,
    title: "24/7 Priority Concierge Support",
    description: "Our dedicated team provides architectural consultation for every project, from material selection to sizing optimization."
  },
  {
    icon: <RotateCcw className="h-6 w-6 text-[#1a4d2e]" />,
    title: "Seamless Return Infrastructure",
    description: "Merchandise can be exchanged within a 30-day window, ensuring your brand standards are consistently maintained."
  },
  {
    icon: <Eye className="h-6 w-6 text-[#1a4d2e]" />,
    title: "Digital Mockup Protocol",
    description: "Visualize your brand artwork with high-fidelity digital mockups before initiating global production runs."
  },
  {
    icon: <BadgeDollarSign className="h-6 w-6 text-[#1a4d2e]" />,
    title: "Wholesale Rate Optimization",
    description: "We provide industry-leading wholesale pricing while maintaining the highest architectural standards for your brand."
  },
  {
    icon: <Zap className="h-6 w-6 text-[#1a4d2e]" />,
    title: "Express Production Lifecycle",
    description: "Fast-track production pipelines and global logistics ensure your inventory is delivered on strict timelines."
  },
  {
    icon: <CreditCard className="h-6 w-6 text-[#1a4d2e]" />,
    title: "Flexible Capital Protocols",
    description: "Manage your brand scaling efficiently with interest-free installment options for bulk inventory acquisitions."
  }
];

export const TrustSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="relative bg-white py-20 overflow-hidden border-t border-zinc-100">
      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-black tracking-tighter text-black uppercase"
          >
            The #1 Trusted <span className="italic font-serif text-zinc-400 normal-case tracking-normal">Global Supplier</span>
          </motion.h2>
          <div className="mt-4 w-12 h-1 bg-[#1a4d2e] mx-auto rounded-full" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto"
        >
          {trustFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group flex flex-col md:flex-row gap-6 p-6 rounded-3xl border border-zinc-100 bg-zinc-50 transition-all duration-500 hover:bg-white hover:border-[#1a4d2e]/20 hover:shadow-xl"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-zinc-200 group-hover:border-[#1a4d2e]/30 transition-all duration-500 shadow-sm">
                  {feature.icon}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-black text-black uppercase tracking-tight group-hover:text-[#1a4d2e] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[12px] text-zinc-500 leading-relaxed font-medium uppercase tracking-wide">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <a href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" download="LuxeBags_Brand_Catalog.pdf">
            <Button className="h-14 px-10 rounded-full bg-[#1a4d2e] text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
              <FileDown className="mr-2 h-4 w-4" />
              Download Brand Catalog
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
