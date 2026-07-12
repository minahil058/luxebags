"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle2, ChevronRight, ShoppingBag, Globe, Phone, Mail, User, Loader2, AlertCircle, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function DesignYourBagPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [hasLogo, setHasLogo] = useState("yes");
  const [hasText, setHasText] = useState("no");
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [styleFile, setStyleFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Pakistan",
    state: "",
    bagStyle: "",
    printedText: "",
    imprintSides: "Front Only",
    imprintColors: "Single Color"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file: File, path: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error("File upload failed details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      toast.error("File upload failed. Please check your storage settings.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please provide your name and email.");
      return;
    }

    setLoading(true);
    try {
      let logoUrl = "";
      let styleImageUrl = "";

      if (hasLogo === "yes" && logoFile) {
        logoUrl = await uploadFile(logoFile, 'logos') || "";
      }

      if (styleFile) {
        styleImageUrl = await uploadFile(styleFile, 'references') || "";
      }

      const detailedRequirements = `
[ARCHITECTURAL SPECIFICATIONS]
Bag Style: ${formData.bagStyle}
Text Print: ${hasText === "yes" ? formData.printedText : "None"}
Imprint Sides: ${formData.imprintSides}
Imprint Colors: ${formData.imprintColors}

[LOGISTICS DATA]
Phone: ${formData.phone}
Country: ${formData.country}
State: ${formData.state}

[FILES]
Logo URL: ${logoUrl || "Not Provided"}
Style Reference: ${styleImageUrl || "Not Provided"}
      `;

      // Definitive table name verification: 'requests' based on supabase_schema.sql
      const insertData: any = {
        name: formData.name,
        email: formData.email,
        requirements: detailedRequirements,
        type: 'custom'
      };

      // Defensive Insertion Logic:
      // We attempt to insert the full payload. If columns like 'type' are missing, 
      // we strip them and retry with the absolute minimum columns (name, email, requirements).
      
      const { error: primaryError } = await supabase
        .from('requests')
        .insert(insertData);

      if (primaryError) {
        console.warn("Primary insertion failed, attempting defensive fallback. Error:", primaryError.message);
        
        // Strip optional columns if they caused the failure
        const fallbackData = {
          name: formData.name,
          email: formData.email,
          requirements: detailedRequirements
        };

        const { error: fallbackError } = await supabase
          .from('requests')
          .insert(fallbackData);

        if (fallbackError) {
          console.error("Submission error details:", JSON.stringify(fallbackError, Object.getOwnPropertyNames(fallbackError)));
          throw new Error("Unable to save request to database. Please check your table schema.");
        }
      }

      // Success state triggered only after successful database entry
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success("Design inquiry successfully architecturalized.");
      
    } catch (error: any) {
      console.error("Final submission error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      toast.error(error.message || "An unexpected error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <div className="pt-24">
        {/* Breadcrumbs - Ultra Compact */}
        <div className="container mx-auto px-6 mb-3">
          <nav className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-400">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Core Protocol</Link>
            <ChevronRight className="h-2 w-2" />
            <span className="text-zinc-900">Customization</span>
          </nav>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-6 mb-10">
          <div className="relative rounded-[1.5rem] bg-[#f9fdfa] border border-emerald-50 overflow-hidden flex flex-col md:flex-row items-center gap-6 p-4 md:p-8 shadow-sm min-h-[180px]">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#f1f8e9,_transparent)] opacity-30" />
            
            <div className="flex-1 relative z-10 text-center md:text-left space-y-2">
              <h1 className="text-xl md:text-3xl font-black tracking-tighter text-[#1a4d2e] leading-none uppercase">
                Design The Perfect <br />
                Tote Bag <span className="text-emerald-600">For Your Brand!</span>
              </h1>
              <p className="text-[#2e7d32] text-[10px] font-black uppercase tracking-widest max-w-md leading-relaxed opacity-60">
                Tailored architectural solutions exclusively for your identity.
              </p>
            </div>

            <div className="relative w-full md:w-[180px] aspect-square flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-emerald-500/5 blur-[50px] rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop"
                alt="Custom Architectural Bags"
                className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105 z-10"
              />
            </div>
          </div>
        </div>

        {/* Customization Form Section - High Density */}
        <div className="container mx-auto px-6 max-w-4xl">
          {!submitted && (
             <div className="text-center mb-8 space-y-1">
               <h2 className="text-lg md:text-xl font-black tracking-tighter uppercase text-black">Product Customization Form</h2>
               <p className="text-[8px] font-black tracking-[0.2em] text-zinc-400 uppercase max-w-xl mx-auto">
                 Select parameters below to initiate the architecture process.
               </p>
             </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="bg-white border border-zinc-100 rounded-[1.5rem] shadow-sm overflow-hidden mb-20">
              <div className="p-6 md:p-10 space-y-10">
                
                {/* 1. Logo Printing */}
                <div className="space-y-4">
                  <div className="border-b border-zinc-50 pb-2">
                    <h2 className="text-[12px] font-black text-black uppercase tracking-tight">1) Do you want your logo printed?</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <RadioGroup value={hasLogo} onValueChange={setHasLogo} className="flex items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="logo-yes" />
                        <Label htmlFor="logo-yes" className="text-[9px] font-black uppercase tracking-widest cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="logo-no" />
                        <Label htmlFor="logo-no" className="text-[9px] font-black uppercase tracking-widest cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>

                    {hasLogo === "yes" && (
                      <div className="space-y-1.5">
                        <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Upload Attachment*</Label>
                        <div className="relative group">
                          <input 
                            type="file" 
                            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                          />
                          <div className={`w-full h-11 border rounded-xl flex items-center justify-center gap-2.5 bg-zinc-50 transition-all ${logoFile ? 'border-emerald-500 bg-emerald-50 shadow-inner' : 'border-zinc-100 group-hover:border-emerald-500'}`}>
                            <Upload className={`w-3 h-3 ${logoFile ? 'text-emerald-600' : 'text-zinc-400'}`} />
                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
                              {logoFile ? logoFile.name : "Drag Files or Click"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Text Printing */}
                <div className="space-y-4">
                  <div className="border-b border-zinc-50 pb-2">
                    <h2 className="text-[12px] font-black text-black uppercase tracking-tight">2) Do you want any text printed on the bag?</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <RadioGroup value={hasText} onValueChange={setHasText} className="flex items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="text-yes" />
                        <Label htmlFor="text-yes" className="text-[9px] font-black uppercase tracking-widest cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="text-no" />
                        <Label htmlFor="text-no" className="text-[9px] font-black uppercase tracking-widest cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>

                    {hasText === "yes" && (
                      <div className="space-y-1.5">
                        <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Mention your text here*</Label>
                        <Input 
                          name="printedText"
                          value={formData.printedText}
                          onChange={handleInputChange}
                          placeholder="Text specs..." 
                          className="h-11 bg-zinc-50 border-zinc-100 rounded-xl px-4 text-[10px] font-bold focus-visible:ring-emerald-500 shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Bag Style */}
                <div className="space-y-4">
                  <div className="border-b border-zinc-50 pb-2">
                    <h2 className="text-[12px] font-black text-black uppercase tracking-tight">3) Bag Style</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Requirements*</Label>
                      <Input 
                        name="bagStyle"
                        value={formData.bagStyle}
                        onChange={handleInputChange}
                        placeholder="e.g. D-Cut, Bottom Gusset..." 
                        className="h-11 bg-zinc-50 border-zinc-100 rounded-xl px-4 text-[10px] font-bold shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Reference Image</Label>
                      <div className="relative group">
                        <input 
                          type="file" 
                          onChange={(e) => setStyleFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        />
                        <div className={`w-full h-11 border rounded-xl flex items-center justify-center gap-2.5 bg-zinc-50 transition-all ${styleFile ? 'border-emerald-500 bg-emerald-50 shadow-inner' : 'border-zinc-100 group-hover:border-emerald-500'}`}>
                          <Upload className={`w-3 h-3 ${styleFile ? 'text-emerald-600' : 'text-zinc-400'}`} />
                          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
                            {styleFile ? styleFile.name : "Click to Upload"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Print Options */}
                <div className="space-y-4">
                  <div className="border-b border-zinc-50 pb-2">
                    <h2 className="text-[12px] font-black text-black uppercase tracking-tight">4) Print Options</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Imprint sides:*</Label>
                      <select 
                        name="imprintSides"
                        value={formData.imprintSides}
                        onChange={handleInputChange}
                        className="w-full h-11 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all shadow-sm"
                      >
                        <option>Front Only</option>
                        <option>Back Only</option>
                        <option>Both Sides</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Imprint colors:*</Label>
                      <select 
                        name="imprintColors"
                        value={formData.imprintColors}
                        onChange={handleInputChange}
                        className="w-full h-11 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all shadow-sm"
                      >
                        <option>Single Color</option>
                        <option>Multi Color</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 5. User Details */}
                <div className="space-y-4">
                  <div className="border-b border-zinc-50 pb-2">
                    <h2 className="text-[12px] font-black text-black uppercase tracking-tight">5) User Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Name*</Label>
                      <Input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your System Identity" 
                        className="h-10 bg-zinc-50 border-zinc-100 rounded-xl px-4 text-[10px] font-bold shadow-sm" 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Email Address*</Label>
                      <Input 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email Protocol" 
                        className="h-10 bg-zinc-50 border-zinc-100 rounded-xl px-4 text-[10px] font-bold shadow-sm" 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Phone Number*</Label>
                      <Input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Logistics Contact" 
                        className="h-10 bg-zinc-50 border-zinc-100 rounded-xl px-4 text-[10px] font-bold shadow-sm" 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Country*</Label>
                      <select 
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full h-10 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all shadow-sm"
                      >
                        <option>Pakistan</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>UAE</option>
                      </select>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">State*</Label>
                      <select 
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full h-10 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all shadow-sm"
                      >
                        <option value="">Select Options</option>
                        <option>Punjab</option>
                        <option>Sindh</option>
                        <option>KPK</option>
                        <option>Balochistan</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="h-12 px-16 rounded-full bg-black text-white font-black uppercase tracking-[0.2em] text-[9px] hover:bg-emerald-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Architecting...
                      </>
                    ) : "Initiate Customization"}
                  </Button>
                </div>

              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center py-20 text-center bg-white border border-zinc-100 rounded-[3rem] p-8 md:p-16 shadow-2xl mb-24 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-400" />
              
              <div className="w-24 h-24 bg-emerald-500/5 rounded-full flex items-center justify-center mb-10 border border-emerald-500/10 shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter uppercase leading-none text-black">
                Thank <span className="text-emerald-600 italic font-serif normal-case tracking-normal">You</span>
              </h2>
              
              <p className="text-zinc-500 mb-12 max-w-lg text-[11px] leading-relaxed font-bold uppercase tracking-[0.2em]">
                Your customization parameters have been securely logged in our architectural archive. Our team will reach out shortly to finalize the identity blueprint.
              </p>

              {/* Submission Summary */}
              <div className="w-full max-w-md bg-zinc-50/50 border border-zinc-100 rounded-3xl p-8 mb-12 text-left space-y-4">
                <div className="flex items-center gap-3 mb-2">
                   <Package className="w-4 h-4 text-emerald-600" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Request Summary</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                   <div>
                     <p className="text-[8px] font-black text-zinc-400 uppercase mb-1">Architecture</p>
                     <p className="text-[10px] font-bold text-black uppercase">{formData.bagStyle || "Standard Series"}</p>
                   </div>
                   <div>
                     <p className="text-[8px] font-black text-zinc-400 uppercase mb-1">Imprint Side</p>
                     <p className="text-[10px] font-bold text-black uppercase">{formData.imprintSides}</p>
                   </div>
                   <div>
                     <p className="text-[8px] font-black text-zinc-400 uppercase mb-1">Identity Files</p>
                     <p className="text-[10px] font-bold text-emerald-600 uppercase">{logoFile ? "Provided" : "Not Provided"}</p>
                   </div>
                   <div>
                     <p className="text-[8px] font-black text-zinc-400 uppercase mb-1">Contact Protocol</p>
                     <p className="text-[10px] font-bold text-black uppercase">{formData.email}</p>
                   </div>
                </div>
              </div>
              
              <Link href="/shop-all">
                <Button className="h-14 px-12 rounded-full bg-black text-white font-black hover:bg-emerald-600 transition-all uppercase tracking-[0.2em] text-[10px] flex items-center gap-4 group">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
