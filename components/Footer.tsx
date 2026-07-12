"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mail, 
  MapPin, 
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Package,
  Globe,
  ArrowRight
} from "lucide-react";

// Custom Social Icons
const FacebookIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
  </svg>
);

const LinkedinIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="relative bg-black pt-16 border-t border-zinc-900 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-zinc-900">
          
          {/* Brand Pillar */}
          <div className="space-y-6">
            <Link href="/" className="flex flex-col group">
              <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none mb-1">
                LUXE<span className="text-zinc-600 font-light tracking-[0.2em] ml-1">BAGS</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/50 group-hover:text-emerald-500 transition-colors">Architectural Sourcing</span>
            </Link>
            <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-xs">
              Engineering the future of premium retail infrastructure. We provide architectural carrier systems designed for global brand elevation.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FacebookIcon className="w-4 h-4" />, href: "#" },
                { icon: <InstagramIcon className="w-4 h-4" />, href: "#" },
                { icon: <TwitterIcon className="w-4 h-4" />, href: "#" },
                { icon: <LinkedinIcon className="w-4 h-4" />, href: "#" }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all shadow-xl active:scale-90"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Infrastructure Links */}
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-6">Global Access</h4>
            <ul className="space-y-3">
              {[
                { name: "Archive Index", href: "/shop-all" },
                { name: "Material Specs", href: "/collections" },
                { name: "Custom Protocol", href: "/design-your-bag" },
                { name: "Bespoke Request", href: "/design-your-bag" },
                { name: "Client Logs", href: "/reviews" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-black text-zinc-500 hover:text-white transition-all uppercase tracking-tight flex items-center gap-3 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-zinc-800 group-hover:bg-emerald-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Protocol */}
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-6">System Protocols</h4>
            <ul className="space-y-3">
              {["Refund Policy", "Transit Policy", "Data Privacy", "Service Terms", "Vault Security"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm font-black text-zinc-500 hover:text-white transition-all uppercase tracking-tight flex items-center gap-3 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-zinc-800 group-hover:bg-emerald-500 transition-colors" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Hub */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-6">Concierge Desk</h4>
            <div className="space-y-6">
              <Link href="/contact" className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-xl group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">Digital Inquiry</p>
                  <p className="text-sm font-black text-white group-hover:text-emerald-500 transition-colors">concierge@luxebags.co</p>
                </div>
              </Link>
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-xl">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">Global Presence</p>
                  <p className="text-sm font-black text-white leading-tight uppercase tracking-tight">Luxury Avenue, NYC <br/>Studio 402</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-6">
              <form className="relative group">
                <input 
                  type="email" 
                  placeholder="IDENTITY@DOMAIN.COM" 
                  className="w-full h-16 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 text-[10px] font-black tracking-widest text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-white text-black font-black text-[9px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl active:scale-95">
                  JOIN
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Global Security Badges */}
        <div className="py-8 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           {[
             { name: "Encrypted Vault", icon: <ShieldCheck className="w-4 h-4" /> },
             { name: "Global Transit", icon: <Package className="w-4 h-4" /> },
             { name: "Verified Identity", icon: <Globe className="w-4 h-4" /> },
             { name: "Stripe Protocol", icon: <CreditCard className="w-4 h-4" /> }
           ].map((badge, i) => (
             <div key={i} className="flex items-center justify-center gap-3">
               {badge.icon}
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">{badge.name}</span>
             </div>
           ))}
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="py-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700">
            © 2026 LUXEBAGS INFRASTRUCTURE. ALL PROTOCOLS RESERVED.
          </p>
          <div className="flex gap-6">
            {["System Privacy", "Operational Terms", "Cookie Protocol"].map((item) => (
              <Link key={item} href="#" className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
