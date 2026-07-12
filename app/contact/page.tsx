import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <span className="text-[9px] font-black tracking-[0.3em] text-emerald-600 uppercase block">
              SYSTEM COMMUNICATIONS
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
              Establish <span className="text-emerald-600 italic font-serif normal-case tracking-normal">Contact</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 max-w-md mx-auto">
              Initiate secure industrial support inquiries or bespoke specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100 text-center space-y-3">
              <Mail className="w-6 h-6 text-emerald-600 mx-auto" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Digital Channel</h3>
              <p className="text-xs font-bold text-zinc-500">support@luxebags.internal</p>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100 text-center space-y-3">
              <Phone className="w-6 h-6 text-emerald-600 mx-auto" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Logistics Desk</h3>
              <p className="text-xs font-bold text-zinc-500">+92 (000) 000-0000</p>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100 text-center space-y-3">
              <MapPin className="w-6 h-6 text-emerald-600 mx-auto" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Headquarters</h3>
              <p className="text-xs font-bold text-zinc-500">Lahore Hub, Pakistan</p>
            </div>
          </div>

          <div className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-zinc-100 shadow-sm max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">System Identity</label>
                <Input placeholder="Your Name" className="h-12 bg-zinc-50 rounded-xl border-zinc-100 text-xs font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Return Channel</label>
                <Input placeholder="name@company.com" className="h-12 bg-zinc-50 rounded-xl border-zinc-100 text-xs font-bold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Message Directive</label>
                <textarea rows={4} placeholder="State structural requirements..." className="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-xs font-bold outline-none focus:border-emerald-500 transition-all resize-none shadow-sm" />
              </div>
              <Button type="button" className="w-full h-12 rounded-full bg-black text-white font-black uppercase tracking-widest text-[9px] hover:bg-emerald-600 transition-all shadow-md">
                Transmit Protocol
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}