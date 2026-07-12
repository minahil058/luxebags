"use client";

import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, CheckCircle2, ChevronDown, Upload, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitRequest } from "@/app/actions";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "sample" | "custom" | "quote";
  title: string;
}

const COUNTRIES = [
  { name: "Afghanistan", dial: "+93", flag: "🇦🇫" },
  { name: "Albania", dial: "+355", flag: "🇦🇱" },
  { name: "Algeria", dial: "+213", flag: "🇩🇿" },
  { name: "Andorra", dial: "+376", flag: "🇦🇩" },
  { name: "United States", dial: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { name: "Pakistan", dial: "+92", flag: "🇵🇰" },
];

const QUANTITIES = [
  "100-250", "250-500", "500-1000", "1000-2500", "2500-5000", "5000-10000", "10000-20000", "20000+"
];

export const RequestModal = ({ isOpen, onClose, type, title }: RequestModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "United States",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    product: "Reusable Heavy-Duty Non-Woven Tote Bag - 11 x 10.5 x 3.5",
    productionType: "Sample",
    instructions: "",
    quantity: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileName, setFileName] = useState("");

  const selectedCountry = COUNTRIES.find(c => c.name === formData.country) || COUNTRIES[4];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await submitRequest({
        ...formData,
        phone: `${selectedCountry.dial} ${formData.phone}`,
        requirements: type === "sample" 
          ? `COMPANY: ${formData.company} | ADDR: ${formData.address}, ${formData.city}, ${formData.state} | PRODUCT: ${formData.product} | INSTR: ${formData.instructions}`
          : `QUANTITY: ${formData.quantity}`,
        type
      });

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setFormData({
            name: "", email: "", country: "United States", phone: "", 
            company: "", address: "", city: "", state: "", 
            product: "Reusable Heavy-Duty Non-Woven Tote Bag - 11 x 10.5 x 3.5", 
            productionType: "Sample", instructions: "", quantity: ""
          });
          setFileName("");
        }, 3000);
      } else {
        alert(`PROTOCOL ERROR: ${result.error}`);
      }
    } catch (err: any) {
      alert(`SYNC ERROR: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-zinc-200 text-zinc-900 w-[95vw] sm:w-full sm:max-w-[800px] rounded-xl p-6 md:p-10 overflow-hidden shadow-2xl antialiased">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-xl md:text-2xl font-bold text-zinc-800 tracking-tight leading-tight">
            {type === "sample" ? "Request a free sample for just $35 with free shipping" : title}
          </DialogTitle>
        </DialogHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Common Fields */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-600">Name*</label>
                <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-white border-zinc-200 h-11 rounded-md text-zinc-900" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-600">Email*</label>
                <Input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-white border-zinc-200 h-11 rounded-md text-zinc-900" />
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-600">Phone*</label>
                <div className="flex border border-zinc-200 rounded-md overflow-hidden bg-white">
                  <Select value={formData.country} onValueChange={(val) => setFormData({...formData, country: val})}>
                    <SelectTrigger className="w-24 border-none h-11 focus:ring-0 text-zinc-900 bg-white">
                       <SelectValue>{selectedCountry.flag} ({selectedCountry.dial})</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-zinc-200 text-zinc-900 shadow-2xl z-[100]">
                      {COUNTRIES.map((c) => (
                        <SelectItem 
                          key={c.name} 
                          value={c.name} 
                          className="cursor-pointer focus:bg-zinc-100 !text-zinc-900 font-medium"
                        >
                          <span className="!text-zinc-900">{c.flag} {c.name} ({c.dial})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="flex-1 border-none h-11 focus:ring-0 text-zinc-900 bg-white" />
                </div>
              </div>

              {type === "sample" ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-600">Company*</label>
                    <Input required value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="bg-white border-zinc-200 h-11 rounded-md text-zinc-900" />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-600">Street Address*</label>
                    <Input required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="bg-white border-zinc-200 h-11 rounded-md text-zinc-900" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-600">City*</label>
                    <Input required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="bg-white border-zinc-200 h-11 rounded-md text-zinc-900" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-600">State*</label>
                    <Input required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="bg-white border-zinc-200 h-11 rounded-md text-zinc-900" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-600">Product for Sample</label>
                    <Input readOnly value={formData.product} className="bg-zinc-50 border-zinc-200 h-11 rounded-md text-zinc-500 text-[10px]" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-600">Production Type</label>
                    <Input readOnly value={formData.productionType} className="bg-zinc-50 border-zinc-200 h-11 rounded-md text-zinc-500 text-[10px]" />
                  </div>

                  {/* Artwork Upload */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-600">Upload Artwork/Logo</label>
                    <div className="flex items-center gap-4">
                       <label className="cursor-pointer bg-zinc-100 border border-zinc-200 px-4 py-1.5 rounded-md text-[10px] font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 text-zinc-900">
                          Browse...
                          <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
                       </label>
                       <span className="text-[10px] text-zinc-400">{fileName || "No file selected"}</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-600">Instructions (if Any)</label>
                    <textarea value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})} className="w-full min-h-[80px] bg-white border border-zinc-200 rounded-md p-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none text-zinc-900" />
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-600">Quantity*</label>
                  <Select required onValueChange={(val) => setFormData({...formData, quantity: val})}>
                    <SelectTrigger className="bg-white border-zinc-200 h-11 rounded-md focus:ring-0 text-zinc-900">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-zinc-200 text-zinc-900 shadow-2xl z-[100]">
                      {QUANTITIES.map(q => (
                        <SelectItem 
                          key={q} 
                          value={q} 
                          className="cursor-pointer focus:bg-zinc-100 !text-zinc-900 font-medium"
                        >
                          <span className="!text-zinc-900">{q}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-center pt-4">
              <Button type="submit" disabled={isLoading} className="w-32 h-10 bg-[#0a111a] text-white font-medium hover:bg-zinc-800 rounded-md transition-all shadow-md">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <p className="text-xl font-normal text-zinc-900">Your request has been submitted successfully!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
