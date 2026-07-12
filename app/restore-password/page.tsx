"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RestorePasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please provide an email identifier.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard/settings`,
      });

      if (resetError) throw resetError;
      
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to initialize restoration protocol.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-zinc-900 font-sans selection:bg-emerald-500 selection:text-white antialiased">
      <Navbar />

      <div className="pt-32 pb-24 px-6 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-[440px]">
          
          <div className="mb-10 text-center space-y-4">
             <div className="w-16 h-16 bg-white rounded-full border border-zinc-100 flex items-center justify-center mx-auto shadow-sm mb-6">
                <Lock className="w-6 h-6 text-zinc-900" />
             </div>
             <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Restore <span className="text-emerald-600 italic font-serif normal-case tracking-normal">Access</span></h1>
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">
               Enter your registered email to receive secure restoration instructions.
             </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-zinc-100 shadow-xl shadow-black/5">
             <AnimatePresence mode="wait">
               {isSuccess ? (
                 <motion.div 
                   key="success"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-center space-y-8 py-4"
                 >
                   <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                     <ShieldCheck className="w-8 h-8 text-emerald-600" />
                   </div>
                   <div className="space-y-2">
                     <h3 className="text-[14px] font-black uppercase tracking-widest text-zinc-900">Protocol Initiated</h3>
                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                        Restoration link dispatched to <br/><span className="text-zinc-900 font-black mt-1 inline-block">{email}</span>
                     </p>
                   </div>
                   <Link href="/login" className="block pt-4">
                     <Button variant="outline" className="w-full h-14 rounded-xl border-zinc-200 text-zinc-900 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-50 transition-all flex items-center justify-center gap-3">
                        <ArrowLeft className="w-4 h-4" /> Return to Login
                     </Button>
                   </Link>
                 </motion.div>
               ) : (
                 <motion.form 
                   key="form"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   onSubmit={handleRestore} 
                   className="space-y-6"
                 >
                   {error && (
                     <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest flex items-start gap-3">
                        <div className="mt-0.5">•</div>
                        <div>{error}</div>
                     </div>
                   )}
                   
                   <div className="space-y-4">
                      <div className="relative group">
                         <Input 
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="h-14 rounded-xl border-zinc-200 bg-zinc-50/50 px-5 pt-4 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                           placeholder="user@example.com"
                           required
                         />
                         <label className="absolute left-5 top-1.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-emerald-600">Email Identifier</label>
                      </div>
                   </div>

                   <Button 
                     type="submit" 
                     disabled={isLoading}
                     className="w-full h-14 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center gap-3 group"
                   >
                     {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                       <>
                         Dispatch Link <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                       </>
                     )}
                   </Button>

                   <div className="pt-6 border-t border-zinc-100 text-center">
                     <Link href="/login" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-black transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft className="w-3 h-3" /> Back to Authentication
                     </Link>
                   </div>
                 </motion.form>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
