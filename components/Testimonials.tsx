"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  review: string;
  rating: number;
}

const professionalReviews: Testimonial[] = [
  {
    id: "r1",
    name: "Lora Eahl",
    review: "Absolutely delighted with the quality and durability of these tote bags! Our clients love the trendy and cool designs, and they've been a hit at our events, too. Highly recommended.",
    rating: 5,
  },
  {
    id: "r2",
    name: "Tim James",
    review: "Top-notch tote bags with an impressive service. The customization options were endless, and the team ensured our order was delivered on time. Definitely looking forward to reordering!",
    rating: 5,
  },
  {
    id: "r3",
    name: "Rob Liam",
    review: "The versatility and style of these tote bags are unmatched! We used them for giveaways, and our customers praised their usefulness and the striking designs. They have proved to be a fantastic addition to our brand promotions!",
    rating: 5,
  },
];

export const Testimonials = () => {
  const [index, setIndex] = useState(0);

  const visibleReviews = [
    professionalReviews[index % professionalReviews.length],
    professionalReviews[(index + 1) % professionalReviews.length],
    professionalReviews[(index + 2) % professionalReviews.length],
  ];

  return (
    <section className="relative bg-black py-16 overflow-hidden border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-black tracking-tighter text-white max-w-2xl mx-auto leading-tight mb-6 uppercase"
          >
            We Like To Keep Our Customers Happy, <br className="hidden md:block" />
            <span className="text-zinc-500 italic font-serif normal-case tracking-normal">What they say about us</span>
          </motion.h2>

          <div className="flex flex-col items-center gap-2">
            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.4em]">
              4.85 Average | 1810 Reviews
            </p>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-black text-[9px] tracking-widest">EXCELLENT</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {visibleReviews.map((item, i) => (
                <div
                  key={`${item.id}-${i}`}
                  className="flex flex-col p-6 rounded-3xl bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl hover:border-zinc-700 transition-all duration-700 min-h-[260px] group shadow-xl"
                >
                  <div className="mb-4">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />
                      ))}
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-[11px] font-medium italic">
                      &quot;{item.review}&quot;
                    </p>
                  </div>

                  <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                    <h4 className="text-white font-black tracking-widest text-[9px] uppercase group-hover:text-emerald-500 transition-colors">
                      {item.name}
                    </h4>
                    <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[9px] font-black text-zinc-500">
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex justify-center items-center gap-3">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => setIndex(i * 3)}
              className={`transition-all duration-700 rounded-full h-1 ${Math.floor(index / 3) === i
                  ? "w-8 bg-emerald-500"
                  : "w-2 bg-zinc-800 hover:bg-zinc-700"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
