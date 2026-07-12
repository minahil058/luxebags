"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { User, UserPlus, KeyRound, ChevronRight, ShieldCheck, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AccountPortalPage() {
  const router = useRouter();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("SESSION TERMINATED");
    router.refresh();
  };

  const portalOptions = [
    {
      title: "Log in",
      icon: <User className="w-8 h-8 stroke-[1.2]" />,
      desc: "Access your procurement manifest and order history.",
      href: "/login",
      delay: 0.1
    },
    {
      title: "Registration",
      icon: <UserPlus className="w-8 h-8 stroke-[1.2]" />,
      desc: "Initialize your identity within the elite network.",
      href: "/register",
      delay: 0.2
    },
    {
      title: "Restore Password",
      icon: <KeyRound className="w-8 h-8 stroke-[1.2]" />,
      desc: "Re-authenticate credentials via encrypted protocol.",
      href: "/restore-password",
      delay: 0.3
    }
  ];

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-50 selection:text-emerald-900 antialiased">
      <Navbar />
      
      <div className="pt-[110px] pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          
          {/* Tightened Breadcrumbs */}
          <nav className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-zinc-200">/</span>
            <span className="text-zinc-900">Account</span>
          </nav>

          {/* Compact Heading Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-8">
            <div className="space-y-2">
               <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 uppercase leading-none">Account <span className="text-emerald-600 font-serif normal-case italic font-normal tracking-normal ml-2">Portal</span></h1>
               <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Identity & Security Management</p>
            </div>
            <div className="flex items-center gap-3 text-[8px] font-black text-zinc-300 uppercase tracking-widest">
               <ShieldCheck className="w-3.5 h-3.5" />
               Secure Session Protocol v.2.0
            </div>
          </div>

          {/* Re-Engineered Compact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
             {portalOptions.map((option) => (
               <Link key={option.title} href={option.href} className="group">
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: option.delay, duration: 0.4 }}
                    className="bg-white border border-zinc-100 rounded-[2rem] p-8 flex flex-col items-center text-center gap-6 transition-all duration-500 group-hover:border-emerald-500/20 group-hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.08)] relative overflow-hidden"
                  >
                     <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                     
                     <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all duration-500 border border-zinc-50 group-hover:border-emerald-100">
                        {option.icon}
                     </div>

                     <div className="space-y-3">
                        <h2 className="text-lg font-black uppercase tracking-tight text-zinc-900 group-hover:text-emerald-700 transition-colors">
                           {option.title}
                        </h2>
                        <p className="text-[9px] font-bold text-zinc-400 group-hover:text-zinc-600 uppercase tracking-widest leading-relaxed px-2">
                           {option.desc}
                        </p>
                     </div>

                     <div className="flex items-center gap-2 text-[8px] font-black text-zinc-300 group-hover:text-zinc-900 uppercase tracking-[0.2em] transition-all pt-2">
                        Initialize <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                     </div>
                  </motion.div>
               </Link>
             ))}
          </div>

          {/* Emergency Session Clear */}
          <div className="mt-12 flex justify-center">
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest shadow-sm"
            >
              <LogOut className="w-3 h-3" />
              Force Session Terminate
            </button>
          </div>

          {/* Minimal Trust Section */}
          <div className="mt-16 pt-12 border-t border-zinc-50">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-30">
                {['Encryption', 'Compliance', 'Privacy', 'Security'].map(label => (
                  <div key={label} className="flex flex-col items-center gap-2">
                     <div className="w-0.5 h-3 bg-zinc-200" />
                     <span className="text-[7px] font-black uppercase tracking-[0.4em]">{label} Protocol</span>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}

