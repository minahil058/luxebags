"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast.success("AUTHENTICATION SUCCESSFUL", {
        description: "Welcome back to the LuxeBags platform."
      });
      
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error("AUTHENTICATION FAILED", {
        description: err.message || "Please verify your credentials."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-50 selection:text-emerald-900 antialiased">
      <Navbar />
      
      <div className="pt-[110px] pb-20">
        <div className="max-w-[420px] mx-auto px-6">
          
          {/* Tightened Breadcrumbs */}
          <nav className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-zinc-200">/</span>
            <Link href="/account" className="hover:text-black transition-colors">Account</Link>
            <span className="text-zinc-200">/</span>
            <span className="text-zinc-900">Login</span>
          </nav>

          {/* Compact Heading */}
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase mb-2">Log in</h1>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Enter credentials to access your archive.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <div className="relative group">
                <Input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-14 rounded-none border-zinc-200 bg-white px-4 pt-4 text-xs focus:ring-0 focus:border-zinc-900 transition-all placeholder:text-zinc-300" 
                  placeholder="Email Address"
                />
                <label className="absolute left-4 top-2 text-[8px] font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-zinc-900">Identifier</label>
              </div>

              <div className="relative group">
                <Input 
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-14 rounded-none border-zinc-200 bg-white px-4 pt-4 text-xs focus:ring-0 focus:border-zinc-900 transition-all placeholder:text-zinc-300" 
                  placeholder="Password"
                />
                <label className="absolute left-4 top-2 text-[8px] font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-zinc-900">Security Key</label>
              </div>
            </div>

            <div className="flex items-center justify-between">
               <Link href="/restore-password" className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
                  Forgot your password?
               </Link>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-black text-white rounded-none font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Establish Connection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="pt-6 border-t border-zinc-50 text-center">
               <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  New to LuxeBags? 
                  <Link href="/register" className="ml-2 text-zinc-900 hover:underline underline-offset-4">Create account</Link>
               </p>
            </div>
          </form>

          {/* Compact Secure Badge */}
          <div className="mt-12 p-6 bg-zinc-50/50 border border-zinc-100 rounded-3xl flex items-center gap-4">
             <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-zinc-900 border border-zinc-100 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
             </div>
             <div>
                <p className="text-[9px] font-black text-zinc-900 uppercase tracking-widest mb-0.5">Encrypted Session</p>
                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-tight">
                   Industrial Grade Auth Protocol.
                </p>
             </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}
