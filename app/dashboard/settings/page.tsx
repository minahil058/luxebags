"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Loader2, User, MapPin, ShieldCheck, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "address" ? "address" : "profile";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "address">(initialTab as any);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const meta = session.user.user_metadata;
      setFormData({
        firstName: meta?.first_name || "",
        lastName: meta?.last_name || "",
        address: meta?.address || "",
        city: meta?.city || "",
        postalCode: meta?.postal_code || "",
        phone: meta?.phone || ""
      });
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          phone: formData.phone
        }
      });

      if (error) throw error;

      toast.success("PROTOCOL UPDATED", {
        description: "Your identity and logistics data have been securely saved."
      });
      
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error("UPDATE FAILED", {
        description: err.message || "Could not synchronize data."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-200" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-50 selection:text-emerald-900 antialiased">
      <Navbar />
      
      <div className="pt-[110px] pb-20">
        <div className="max-w-[600px] mx-auto px-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-zinc-200">/</span>
            <Link href="/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
            <span className="text-zinc-200">/</span>
            <span className="text-zinc-900">Settings</span>
          </nav>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase mb-2">Configuration</h1>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Update your identity and logistics coordinates.</p>
          </div>

          {/* Custom Tab Navigation */}
          <div className="flex gap-2 p-1 bg-zinc-50 border border-zinc-100 rounded-2xl mb-8">
             <button 
               type="button"
               onClick={() => setActiveTab("profile")}
               className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}
             >
                <User className="w-3.5 h-3.5" /> Identity
             </button>
             <button 
               type="button"
               onClick={() => setActiveTab("address")}
               className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'address' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}
             >
                <MapPin className="w-3.5 h-3.5" /> Logistics
             </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <AnimatePresence mode="wait">
               {activeTab === "profile" && (
                 <motion.div 
                   key="profile"
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 10 }}
                   transition={{ duration: 0.2 }}
                   className="space-y-4"
                 >
                    <div className="grid grid-cols-2 gap-4">
                       <div className="relative group">
                         <Input 
                           value={formData.firstName}
                           onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                           className="h-14 rounded-xl border-zinc-200 bg-white px-4 pt-4 text-xs focus:ring-0 focus:border-zinc-900 transition-all placeholder:text-zinc-300" 
                           placeholder="First Name"
                         />
                         <label className="absolute left-4 top-2 text-[8px] font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-zinc-900">Identity</label>
                       </div>
                       <div className="relative group">
                         <Input 
                           value={formData.lastName}
                           onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                           className="h-14 rounded-xl border-zinc-200 bg-white px-4 pt-4 text-xs focus:ring-0 focus:border-zinc-900 transition-all placeholder:text-zinc-300" 
                           placeholder="Last Name"
                         />
                         <label className="absolute left-4 top-2 text-[8px] font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-zinc-900">Surname</label>
                       </div>
                    </div>
                    <div className="relative group">
                      <Input 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-14 rounded-xl border-zinc-200 bg-white px-4 pt-4 text-xs focus:ring-0 focus:border-zinc-900 transition-all placeholder:text-zinc-300" 
                        placeholder="Phone Number"
                      />
                      <label className="absolute left-4 top-2 text-[8px] font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-zinc-900">Contact Node</label>
                    </div>
                 </motion.div>
               )}

               {activeTab === "address" && (
                 <motion.div 
                   key="address"
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 10 }}
                   transition={{ duration: 0.2 }}
                   className="space-y-4"
                 >
                    <div className="relative group">
                      <Input 
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="h-14 rounded-xl border-zinc-200 bg-white px-4 pt-4 text-xs focus:ring-0 focus:border-zinc-900 transition-all placeholder:text-zinc-300" 
                        placeholder="Street Address"
                      />
                      <label className="absolute left-4 top-2 text-[8px] font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-zinc-900">Coordinates</label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="relative group">
                         <Input 
                           value={formData.city}
                           onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                           className="h-14 rounded-xl border-zinc-200 bg-white px-4 pt-4 text-xs focus:ring-0 focus:border-zinc-900 transition-all placeholder:text-zinc-300" 
                           placeholder="City"
                         />
                         <label className="absolute left-4 top-2 text-[8px] font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-zinc-900">Sector</label>
                       </div>
                       <div className="relative group">
                         <Input 
                           value={formData.postalCode}
                           onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                           className="h-14 rounded-xl border-zinc-200 bg-white px-4 pt-4 text-xs focus:ring-0 focus:border-zinc-900 transition-all placeholder:text-zinc-300" 
                           placeholder="Postal Code"
                         />
                         <label className="absolute left-4 top-2 text-[8px] font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-zinc-900">Routing Code</label>
                       </div>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

            <div className="pt-6 border-t border-zinc-50 flex gap-4">
               <Link href="/dashboard" className="flex-1">
                 <Button 
                   type="button"
                   variant="outline"
                   className="w-full h-14 bg-white border-zinc-200 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-50 transition-all"
                 >
                   Cancel
                 </Button>
               </Link>
               <Button 
                 type="submit"
                 disabled={saving}
                 className="flex-1 h-14 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 group"
               >
                 {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                   <>
                     Synchronize Data
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </Button>
            </div>
          </form>

          {/* Compact Secure Badge */}
          <div className="mt-12 p-6 bg-zinc-50/50 border border-zinc-100 rounded-3xl flex items-center gap-4">
             <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-zinc-900 border border-zinc-100 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
             </div>
             <div>
                <p className="text-[9px] font-black text-zinc-900 uppercase tracking-widest mb-0.5">Encrypted Protocol</p>
                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-tight">
                   Personal Data is encrypted and securely stored.
                </p>
             </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}

export default function SettingsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-200" /></div>}>
      <SettingsContent />
    </React.Suspense>
  );
}
