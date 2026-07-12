"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { BackgroundTexture } from "./BackgroundTexture";
import { subscribeToNewsletter } from "@/app/actions";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const result = await subscribeToNewsletter(email);
    
    if (result.success) {
      setMessage({ type: "success", text: "Thank you for subscribing!" });
      setEmail("");
    } else {
      setMessage({ type: "error", text: result.error || "Something went wrong." });
    }
    setIsLoading(false);
  };

  return (
    <section className="relative py-16 bg-black overflow-hidden border-t border-white/5">
      <BackgroundTexture />
      
      {/* Floating Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#22c55e]/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto p-10 md:p-14 rounded-3xl border border-white/10 bg-zinc-900/20 backdrop-blur-3xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4 uppercase tracking-tighter">
                Subscribe To Our <br /><span className="text-emerald-500 italic font-serif normal-case tracking-normal">Newsletter</span>
              </h2>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-sm">
                Get the latest updates on new arrivals, exclusive offers, and architectural industrial insights.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <form onSubmit={handleSubscribe} className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="IDENTITY@DOMAIN.COM"
                  required
                  className="w-full h-14 bg-black border border-white/10 rounded-xl px-6 text-[10px] font-black tracking-widest text-white placeholder:text-zinc-800 outline-none transition-all focus:border-emerald-500"
                />
                
                <div className="absolute right-1.5 top-1.5 h-11">
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="h-full px-8 rounded-lg bg-emerald-500 text-black font-black text-[9px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"} <Send className="h-3.5 w-3.5" />
                    </span>
                  </Button>
                </div>
              </form>
              
              {message && (
                <p className={`text-[9px] font-black uppercase tracking-widest text-center lg:text-left ${message.type === "success" ? "text-emerald-500" : "text-red-500"}`}>
                  {message.text}
                </p>
              )}

              <p className="text-zinc-700 text-[8px] font-black uppercase tracking-widest text-center lg:text-left">
                We respect your privacy protocol.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
