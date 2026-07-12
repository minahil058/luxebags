"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, X, ChevronDown, Trash2, Minus, Plus, ArrowRight, Clock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/useCartStore";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import { getSmartSrc } from "@/lib/utils";
import Image from "next/image";

export const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedTab, setMobileExpandedTab] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { products, fetchProducts } = useProductStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = useCartStore((state) => state.totalItems());
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getCartTotal = useCartStore((state) => state.getCartTotal);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    if (products.length === 0) {
      fetchProducts();
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // First try local store search (fast and reliable)
    const localResults = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (localResults.length > 0) {
      setResults(localResults);
      setIsSearching(false);
      return;
    }

    // Fallback to Supabase if local results are empty
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(5);

      if (!error && data) {
        setResults(data);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop By Usage", href: "/#usage", hasDropdown: true },
    { name: "Shop By Styles", href: "/#styles", hasDropdown: true },
    { name: "Bags", href: "/collections" },
    { name: "All Products", href: "/shop-all" },
    { name: "Design Your Bags", href: "/design-your-bag" },
    { name: "Custom Creations", href: "/custom-creations", highlight: true }
  ];

  const usageCategories = products.filter(p => p.type === 'usage');
  const styleCategories = products.filter(p => p.type === 'style');

  const subtotal = useMemo(() => getCartTotal(), [cartItems]);

  return (
    <>
      <header className={`w-full fixed top-0 z-50 transition-all duration-700 ${isScrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-2" : "bg-black py-3"}`}>
      <div className="container mx-auto px-6 md:px-10 flex items-center justify-between gap-8">
        {/* 1. LOGO */}
        <Link href="/" className="flex-shrink-0 group">
          <div className="text-2xl font-black tracking-tighter text-white flex items-baseline gap-1">
            LUXE<span className="text-zinc-500 font-light tracking-widest">BAGS</span>
          </div>
        </Link>

        {/* 2. NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              <Link 
                href={item.href}
                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-1.5 py-2 ${
                  item.highlight 
                    ? "text-red-500 hover:text-red-400" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.name}
                {item.hasDropdown && <ChevronDown className="h-3 w-3 opacity-50 transition-transform duration-300 group-hover:rotate-180" />}
              </Link>
              
              {/* Dropdown Menu */}
              {item.hasDropdown && (
                <div className="absolute top-full left-0 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50 translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white border border-zinc-100 rounded-xl shadow-xl py-2 min-w-[220px] flex flex-col">
                    {item.name === "Shop By Styles" ? (
                      styleCategories.length > 0 ? (
                        styleCategories.map(cat => (
                          <Link key={cat.id} href={`/category/${encodeURIComponent(cat.category)}`} className="px-5 py-3 text-[9px] font-black text-zinc-500 hover:bg-zinc-50 hover:text-emerald-600 uppercase tracking-widest transition-colors flex items-center gap-3 group/link">
                             <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover/link:bg-emerald-500 transition-colors" />
                             {cat.name}
                          </Link>
                        ))
                      ) : (
                         <span className="px-5 py-3 text-[9px] font-black text-zinc-400 uppercase tracking-widest">No Styles Found</span>
                      )
                    ) : item.name === "Shop By Usage" ? (
                      usageCategories.length > 0 ? (
                        usageCategories.map(cat => (
                          <Link key={cat.id} href={`/category/${encodeURIComponent(cat.category)}`} className="px-5 py-3 text-[9px] font-black text-zinc-500 hover:bg-zinc-50 hover:text-emerald-600 uppercase tracking-widest transition-colors flex items-center gap-3 group/link">
                             <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover/link:bg-emerald-500 transition-colors" />
                             {cat.name}
                          </Link>
                        ))
                      ) : (
                         <span className="px-5 py-3 text-[9px] font-black text-zinc-400 uppercase tracking-widest">No Usages Found</span>
                      )
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* 3. INTERACTIVE SEARCH & CART */}
        <div className="flex items-center gap-2 md:gap-5">
          <AnimatePresence mode="wait">
            {!isSearchOpen ? (
              <motion.button
                key="search-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <Search className="h-4 w-4" />
              </motion.button>
            ) : (
              <div className="relative flex flex-col">
                <motion.div
                  key="search-bar"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "220px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative flex items-center"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full h-8 bg-transparent border-b border-white/20 text-white text-[11px] focus:outline-none focus:border-white transition-all placeholder:text-zinc-700"
                  />
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setResults([]);
                    }}
                    className="absolute right-0 p-1 text-zinc-600 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>

                {/* RESULTS DROPDOWN */}
                <AnimatePresence>
                  {results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-4 w-[280px] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                    >
                      {results.map((item) => (
                        <Link 
                          key={item.id} 
                          href={`/product/${item.id}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                            setResults([]);
                          }}
                          className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-all group text-left"
                        >
                          <div className="h-10 w-10 rounded-lg bg-black p-1 flex-shrink-0">
                            <img src={getSmartSrc(item.image_url)} alt={item.name} className="h-full w-full object-contain" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] font-bold text-white truncate group-hover:text-emerald-500 transition-colors uppercase tracking-wider">{item.name}</p>
                            <p className="text-[9px] text-zinc-600">{item.price}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>

          <Link href="/orders" className="hidden sm:flex text-zinc-500 hover:text-white transition-all items-center gap-2 group px-2">
            <Clock className="h-4 w-4" />
            <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Orders</span>
          </Link>

          {user && user.email?.toLowerCase() === "minahilrehmat00@gmail.com" && (
            <Link href="/admin-dashboard" className="hidden sm:flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-all px-2">
               <span className="text-[9px] font-black uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 rounded">Admin</span>
            </Link>
          )}

          <Link href={user ? "/dashboard" : "/account"} className="hidden sm:flex items-center">
            {user ? (
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 hover:text-white transition-colors">
                 {user.user_metadata?.first_name || "Partner"}
              </span>
            ) : (
              <div className="p-2 text-zinc-500 hover:text-white transition-colors">
                <User className="h-4 w-4" />
              </div>
            )}
          </Link>

          <div 
            className="relative h-full flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              href="/cart"
              className="flex items-center gap-2 group focus:outline-none py-2"
            >
              <div className="relative">
                <ShoppingBag className="h-4 w-4 text-white transition-transform group-hover:scale-110" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-black text-[8px] font-black h-3.5 w-3.5 rounded-full flex items-center justify-center border border-black">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-[9px] font-black uppercase tracking-[0.2em] text-white">Cart</span>
            </Link>

            {/* REFINED HIGH-FIDELITY CART HOVER POPUP */}
            <AnimatePresence>
              {isHovered && mounted && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute top-full right-0 mt-4 w-[360px] bg-[#0a0a0a]/95 backdrop-blur-2xl rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.9)] border border-white/10 overflow-hidden z-[60]"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Header - High density premium */}
                  <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                          <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                       </div>
                       <div className="space-y-0.5">
                          <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Procurement Bag</h3>
                          <p className="text-[8px] font-bold text-emerald-500/80 uppercase tracking-widest">{cartCount} Active items</p>
                       </div>
                    </div>
                    <button onClick={() => setIsHovered(false)} className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                       <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item List - High fidelity dark view */}
                  <div className="max-h-[280px] overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">
                    {cartItems.length === 0 ? (
                      <div className="py-10 text-center space-y-3">
                         <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                            <ShoppingBag className="w-4 h-4 text-zinc-600" />
                         </div>
                         <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Manifest Unavailable</p>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3 group relative items-center bg-white/[0.01] p-2 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all">
                           <div className="relative w-12 h-12 bg-black rounded-xl overflow-hidden p-1 flex-shrink-0 border border-white/5">
                              <Image src={getSmartSrc(item.image_url)} alt={item.name} fill className="object-contain p-1 transition-transform duration-700 group-hover:scale-110" unoptimized={true} />
                           </div>
                           <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <div>
                                 <h4 className="text-[9px] font-black text-white uppercase tracking-tight line-clamp-1 group-hover:text-emerald-400 transition-colors">{item.name}</h4>
                                 <p className="text-[9px] font-bold text-zinc-400 mt-0.5">${parseFloat(String(item.price).replace(/[^0-9.]/g, '')).toFixed(2)}</p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                 <div className="flex items-center bg-black rounded-md p-0.5 border border-white/10">
                                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-5 h-5 flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white transition-all rounded"><Minus className="w-2.5 h-2.5" /></button>
                                    <span className="w-5 text-center text-[8px] font-black text-white">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-5 h-5 flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white transition-all rounded"><Plus className="w-2.5 h-2.5" /></button>
                                 </div>
                                 <button onClick={() => removeItem(item.id)} className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
                              </div>
                           </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Summary - Quiet luxury metadata */}
                  <div className="px-5 py-4 bg-white/[0.02] border-t border-white/5 space-y-4">
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                          <span>Subtotal Commitment</span>
                          <span className="text-zinc-300 tracking-tighter">${subtotal.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                          <span>Secure Protocol</span>
                          <span className="text-emerald-500 font-bold tracking-widest">COMPLIMENTARY</span>
                       </div>
                    </div>
 
                    <div className="flex justify-between items-baseline pt-3 border-t border-white/5">
                       <span className="text-[9px] font-black text-white uppercase tracking-widest">Total Settlement</span>
                       <span className="text-lg font-black tracking-tighter text-emerald-400">${subtotal.toFixed(2)}</span>
                    </div>
 
                    <div className="space-y-2 pt-1">
                       <Link href="/checkout" className="w-full block">
                          <Button className="w-full h-10 bg-emerald-500 text-black rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group shadow-[0_10px_20px_rgba(16,185,129,0.2)]">
                             Finalize Manifesto <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                       </Link>
                       <button onClick={() => setIsHovered(false)} className="w-full h-9 bg-transparent text-zinc-500 border border-white/5 rounded-xl font-black text-[8px] uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">
                          Dismiss Panel
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MOBILE MENU TRIGGER */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 lg:hidden text-zinc-400 hover:text-white transition-colors focus:outline-none ml-1"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>

    {/* PREMIUM HIGH-FIDELITY MOBILE NAVIGATION OVERLAY */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-40 lg:hidden overflow-y-auto pt-28 pb-12 px-6 flex flex-col justify-between"
        >
          <div className="space-y-8 max-w-sm mx-auto w-full">
             {/* Quick Actions Bar */}
             <div className="grid grid-cols-3 gap-3 pb-6 border-b border-white/10">
                <Link 
                  href={user ? "/dashboard" : "/account"} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-center gap-1.5"
                >
                   <User className="w-4 h-4 text-emerald-500" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{user ? "Portal" : "Account"}</span>
                </Link>
                <Link 
                  href="/orders" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-center gap-1.5"
                >
                   <Clock className="w-4 h-4 text-amber-500" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Orders</span>
                </Link>
                {user && user.email?.toLowerCase() === "minahilrehmat00@gmail.com" ? (
                  <Link 
                    href="/admin-dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-center gap-1.5"
                  >
                     <span className="w-4 h-4 rounded-full bg-emerald-500 block animate-pulse mx-auto" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Admin</span>
                  </Link>
                ) : (
                  <Link 
                    href="/cart" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-center gap-1.5"
                  >
                     <ShoppingBag className="w-4 h-4 text-red-500" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Bag ({cartCount})</span>
                  </Link>
                )}
             </div>

             {/* Links List */}
             <nav className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.name} className="border-b border-white/5 pb-2">
                     <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          onClick={() => {
                             if (!item.hasDropdown) setIsMobileMenuOpen(false);
                          }}
                          className={`text-base font-black uppercase tracking-[0.2em] py-3 block transition-colors ${
                            item.highlight ? "text-red-500" : "text-white"
                          }`}
                        >
                          {item.name}
                        </Link>
                        {item.hasDropdown && (
                          <button
                            onClick={() => setMobileExpandedTab(mobileExpandedTab === item.name ? null : item.name)}
                            className="p-2 text-zinc-500 hover:text-white"
                          >
                             <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedTab === item.name ? "rotate-180 text-emerald-500" : ""}`} />
                          </button>
                        )}
                     </div>

                     {/* Mobile sub-items */}
                     {item.hasDropdown && mobileExpandedTab === item.name && (
                       <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pl-4 py-2 space-y-2.5 border-l-2 border-emerald-500/30 ml-2">
                          {item.name === "Shop By Styles" ? (
                            styleCategories.map(cat => (
                              <Link 
                                key={cat.id} 
                                href={`/category/${encodeURIComponent(cat.category)}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-[11px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest py-1"
                              >
                                {cat.name}
                              </Link>
                            ))
                          ) : item.name === "Shop By Usage" ? (
                            usageCategories.map(cat => (
                              <Link 
                                key={cat.id} 
                                href={`/category/${encodeURIComponent(cat.category)}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-[11px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest py-1"
                              >
                                {cat.name}
                              </Link>
                            ))
                          ) : null}
                       </motion.div>
                     )}
                  </div>
                ))}
             </nav>
          </div>

          <div className="mt-12 text-center pt-6 border-t border-white/5 max-w-sm mx-auto w-full">
             <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">LUXEBAGS INDUSTRIAL PLATFORM</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};
