"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { User, MapPin, Package, Shield, ArrowRight, LogOut, Loader2, ChevronRight, Map } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const CardContent = ({ card, isLink = false }: { card: any; isLink?: boolean }) => (
  <div className={`h-full bg-white border border-zinc-100 rounded-[2rem] p-8 flex flex-col items-center text-center justify-between transition-all duration-500 relative overflow-hidden ${isLink ? 'hover:border-emerald-500/20 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.08)]' : ''}`}>
     <div className={`absolute top-0 left-0 w-full h-1 bg-emerald-500 scale-x-0 transition-transform duration-500 origin-left ${isLink ? 'group-hover:scale-x-100' : ''}`} />
     
     <div className={`w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 transition-all duration-500 border border-zinc-50 mb-6 ${isLink ? 'group-hover:text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-100' : ''}`}>
        {card.icon}
     </div>

     <div className="w-full">
        <h2 className="text-sm font-black uppercase tracking-tight text-zinc-900 mb-2">
           {card.title}
        </h2>
        {card.content}
     </div>

     {isLink && (
       <div className="flex items-center gap-2 text-[8px] font-black text-zinc-300 group-hover:text-zinc-900 uppercase tracking-[0.2em] transition-all pt-6">
          View <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
       </div>
     )}
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("SESSION TERMINATED", {
       description: "You have been successfully signed out."
    });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-200" />
      </div>
    );
  }

  const fullName = `${user?.user_metadata?.first_name || ""} ${user?.user_metadata?.last_name || ""}`.trim() || "Valued Partner";

  const dashboardCards = [
    {
      title: "Information",
      icon: <User className="w-8 h-8 stroke-[1.2]" />,
      href: "/dashboard/settings",
      content: (
        <div className="space-y-1 mt-4 text-left w-full">
           <p className="text-[10px] font-black text-zinc-900 uppercase tracking-tight">{fullName}</p>
           <p className="text-[10px] font-bold text-zinc-400 lowercase truncate">{user?.email}</p>
        </div>
      ),
      delay: 0.1
    },
    {
      title: "Customer Address",
      icon: <MapPin className="w-8 h-8 stroke-[1.2]" />,
      href: "/dashboard/settings?tab=address",
      content: (
        <div className="space-y-1 mt-4 text-left w-full">
           <p className="text-[10px] font-black text-zinc-900 uppercase tracking-tight">Logistics Base</p>
           {user?.user_metadata?.address ? (
             <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest truncate">
               {user.user_metadata.address}, {user.user_metadata.city || ''}
             </p>
           ) : (
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No address saved yet.</p>
           )}
        </div>
      ),
      delay: 0.2
    },
    {
      title: "Order History",
      icon: <Package className="w-8 h-8 stroke-[1.2]" />,
      href: "/orders",
      content: (
        <div className="space-y-1 mt-4 text-left w-full">
           <p className="text-[10px] font-black text-zinc-900 uppercase tracking-tight">Procurement Manifests</p>
           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">View past transactions</p>
        </div>
      ),
      delay: 0.3
    },
    {
      title: "Security",
      icon: <Shield className="w-8 h-8 stroke-[1.2]" />,
      content: (
        <div className="grid grid-cols-2 gap-2 mt-4 w-full">
           <Link href="/restore-password" className="text-[8px] font-black text-zinc-400 hover:text-black uppercase tracking-widest transition-colors py-2 border border-zinc-50 text-center rounded-lg">
              Reset Key
           </Link>
           <button onClick={handleSignOut} className="text-[8px] font-black text-red-400 hover:text-red-600 hover:bg-red-50 uppercase tracking-widest transition-all py-2 border border-zinc-50 text-center rounded-lg">
              Sign Out
           </button>
        </div>
      ),
      delay: 0.4
    }
  ];

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-50 selection:text-emerald-900 antialiased">
      <Navbar />
      
      <div className="pt-[110px] pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-zinc-200">/</span>
            <Link href="/account" className="hover:text-black transition-colors">Account</Link>
            <span className="text-zinc-200">/</span>
            <span className="text-zinc-900">Dashboard</span>
          </nav>

          {/* Compact Heading Section */}
          <div className="mb-12 border-b border-zinc-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
               <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 uppercase leading-none">
                  Welcome, <span className="text-emerald-600 font-serif normal-case italic font-normal tracking-normal ml-1">{user?.user_metadata?.first_name || "Partner"}</span>
               </h1>
               <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Identity Protocol: Verified Procurement Unit</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest mb-1">Session Status</span>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                     <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Authenticated</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Re-Engineered Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
             {dashboardCards.map((card) => (
               <motion.div 
                 key={card.title}
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: card.delay, duration: 0.4 }}
                 className="h-full"
               >
                  {card.href ? (
                    <Link href={card.href} className="h-full block group">
                       <CardContent card={card} isLink />
                    </Link>
                  ) : (
                    <div className="h-full">
                       <CardContent card={card} />
                    </div>
                  )}
               </motion.div>
             ))}
          </div>

          {/* Secure System Details */}
          <div className="mt-16 pt-12 border-t border-zinc-50 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
             <div className="flex items-center gap-8">
                <div className="flex flex-col gap-1">
                   <span className="text-[7px] font-black uppercase tracking-[0.3em]">Access Node</span>
                   <span className="text-[9px] font-bold">Global-Alpha-01</span>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-[7px] font-black uppercase tracking-[0.3em]">Security Layer</span>
                   <span className="text-[9px] font-bold">Encrypted-V3</span>
                </div>
             </div>
             <div className="flex gap-4">
                {['Terms', 'Privacy', 'Compliance'].map(l => (
                   <span key={l} className="text-[8px] font-black uppercase tracking-widest">{l}</span>
                ))}
             </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}
