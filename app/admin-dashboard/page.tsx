"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, ShieldCheck, X, Package, Search, PackageCheck, Truck, Clock, Save, Image as ImageIcon, Box, LayoutDashboard, ShoppingBag, Users, Edit, Upload, Loader2, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { getSmartSrc } from "@/lib/utils";
import { Product } from "@/types";

const ADMIN_EMAIL = "minahilrehmat00@gmail.com";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"manifests" | "products">("manifests");
  const [isAdminState, setIsAdminState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Slide-over States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({
    name: "", price: 0, description: "", category: "Industrial", image_url: "", stock_quantity: 100
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const [ordersRes, productsRes] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("*") // Removed ordering to prevent schema-specific crashes
    ]);
    
    if (ordersRes.error) console.error("Orders Fetch Error:", ordersRes.error);
    if (productsRes.error) console.error("Products Fetch Error:", productsRes.error);

    if (ordersRes.data) setOrders(ordersRes.data);
    if (productsRes.data) setProducts(productsRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      const isAdmin = user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
      setIsAdminState(isAdmin);

      if (!isAdmin) {
        toast.error("UNAUTHORIZED ACCESS", { description: "Administrative clearance required." });
        router.push("/account");
        return;
      }
      
      fetchData();
    };
    checkAuth();
  }, [router]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
       toast.error("UPDATE FAILED", { description: error.message });
    } else {
       toast.success(`MANIFEST ${orderId.split('-')[0]} UPDATED`, { description: `Status changed to ${newStatus}` });
       fetchData();
    }
  };

  const openEditor = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
    } else {
      setEditingProduct({ name: "", price: 0, description: "", category: "Tote Bags", image_url: "", stock_quantity: 100, type: "standard" });
    }
    setIsEditorOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `catalog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setEditingProduct(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Image successfully uploaded to Archive");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload failed", { description: "Make sure 'product-images' bucket is public and allows uploads." });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingProduct.id) {
        // Update
        const { error } = await supabase.from("products").update(editingProduct).eq("id", editingProduct.id);
        if (error) throw error;
        toast.success("Protocol Successfully Initialized");
      } else {
        // Insert
        const { id, ...dataToInsert } = editingProduct;
        const { error } = await supabase.from("products").insert([dataToInsert]);
        if (error) throw error;
        toast.success("Protocol Successfully Initialized");
      }
      setIsEditorOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error("SAVE FAILED", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to permanently archive/delete this protocol? This action cannot be undone.")) return;
    
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Protocol Deleted", { description: "The architecture has been purged from the database." });
      fetchData();
    } catch (err: any) {
      toast.error("Deletion Failed", { description: err.message });
    }
  };

  if (!isAdminState && !isLoading) return null;

  const filteredProducts = products.filter(p => 
    (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-zinc-900 font-sans selection:bg-emerald-500 selection:text-white antialiased">
      <Navbar />

      <div className="pt-32 pb-4 max-w-[1400px] mx-auto px-6">
      </div>

      <div className="pb-24 max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-12 min-h-[80vh]">
         {/* Sidebar */}
         <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-8">
               <div>
                  <div className="w-12 h-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center mb-4">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">Command Center</h1>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{ADMIN_EMAIL}</p>
               </div>

               <nav className="flex flex-col gap-2">
                  <button 
                    onClick={() => setActiveTab('manifests')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manifests' ? 'bg-zinc-900 text-white shadow-lg' : 'bg-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
                  >
                     <Package className="w-4 h-4" /> Logistics Manifests
                  </button>
                  <button 
                    onClick={() => setActiveTab('products')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-zinc-900 text-white shadow-lg' : 'bg-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
                  >
                     <Box className="w-4 h-4" /> Creation Suite
                  </button>
               </nav>
            </div>
         </div>

         {/* Main Content */}
         <div className="flex-1 bg-white border border-zinc-100 rounded-[2rem] shadow-sm p-6 md:p-10 min-h-[60vh] relative overflow-hidden">
            {isLoading ? (
               <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                  <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
               </div>
            ) : null}

            {activeTab === 'manifests' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
                     <h2 className="text-lg font-black uppercase tracking-widest">Active Manifests</h2>
                     <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                        {orders.length} Records
                     </div>
                  </div>

                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="border-b border-zinc-100 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
                              <th className="pb-4 font-black">Manifest ID</th>
                              <th className="pb-4 font-black">Identity</th>
                              <th className="pb-4 font-black">Amount</th>
                              <th className="pb-4 font-black">Status</th>
                              <th className="pb-4 font-black text-right">Protocol Action</th>
                           </tr>
                        </thead>
                        <tbody className="text-[11px] font-bold text-zinc-600 uppercase tracking-wide">
                           {orders.map((order) => {
                              const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
                              
                              return (
                                 <React.Fragment key={order.id}>
                                    <tr onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors cursor-pointer group">
                                       <td className="py-5 font-black text-zinc-900 flex items-center gap-2">
                                          <ChevronRight className={`w-3 h-3 transition-transform ${expandedOrderId === order.id ? 'rotate-90 text-emerald-500' : 'text-zinc-300'}`} />
                                          {order.id.split('-')[0]}
                                       </td>
                                       <td className="py-5">{order.user_email}</td>
                                       <td className="py-5 text-emerald-600 font-black">${order.total_amount}</td>
                                       <td className="py-5">
                                          <span className={`px-2 py-1 rounded text-[9px] font-black tracking-widest ${
                                             order.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                             order.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                             order.status === 'Dispatched' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                             'bg-zinc-100 text-zinc-600 border border-zinc-200'
                                          }`}>
                                             {order.status}
                                          </span>
                                       </td>
                                       <td className="py-5 text-right">
                                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                             <button onClick={() => updateOrderStatus(order.id, 'Dispatched')} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group" title="Mark Dispatched">
                                                <Truck className="w-4 h-4 text-zinc-400 group-hover:text-blue-600" />
                                             </button>
                                             <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="p-2 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors group" title="Mark Delivered">
                                                <PackageCheck className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600" />
                                             </button>
                                          </div>
                                       </td>
                                    </tr>
                                    
                                    <AnimatePresence>
                                       {expandedOrderId === order.id && (
                                          <tr>
                                             <td colSpan={5} className="p-0">
                                                <motion.div 
                                                   initial={{ height: 0, opacity: 0 }}
                                                   animate={{ height: "auto", opacity: 1 }}
                                                   exit={{ height: 0, opacity: 0 }}
                                                   className="overflow-hidden bg-zinc-50 border-b border-zinc-100"
                                                >
                                                   <div className="p-6">
                                                      <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                                                         <Package className="w-3 h-3" /> Manifest Details
                                                      </h4>
                                                      <div className="space-y-3">
                                                         {items.map((item: any, idx: number) => (
                                                            <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                                                               <div className="flex items-center gap-4">
                                                                  <div className="w-10 h-10 bg-zinc-50 rounded-lg relative overflow-hidden border border-zinc-100 flex items-center justify-center p-1">
                                                                     <Image src={getSmartSrc(item.image_url)} alt={item.name} fill className="object-contain" unoptimized />
                                                                  </div>
                                                                  <div>
                                                                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900">{item.name}</p>
                                                                     <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Qty: {item.quantity} • ${item.price}</p>
                                                                  </div>
                                                               </div>
                                                               <div className="text-[10px] font-black text-emerald-600">
                                                                  ${item.quantity * item.price}
                                                               </div>
                                                            </div>
                                                         ))}
                                                      </div>
                                                   </div>
                                                </motion.div>
                                             </td>
                                          </tr>
                                       )}
                                    </AnimatePresence>
                                 </React.Fragment>
                              );
                           })}
                           {orders.length === 0 && (
                              <tr>
                                 <td colSpan={5} className="py-12 text-center text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                                    No Active Manifests
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'products' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
                     <h2 className="text-lg font-black uppercase tracking-widest">Creation Suite</h2>
                     <div className="flex items-center gap-3">
                        <div className="relative">
                           <Input 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="SEARCH PROTOCOLS..." 
                              className="h-10 pl-10 text-[9px] font-black uppercase tracking-widest w-[200px] bg-zinc-50 border-zinc-200 focus:bg-white" 
                           />
                           <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        </div>
                        <Button onClick={() => openEditor()} className="h-10 bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 shadow-md">
                           <Plus className="w-3.5 h-3.5 mr-2" /> Add Protocol
                        </Button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                     {filteredProducts.map(p => (
                        <div key={p.id} className="border border-zinc-100 rounded-2xl p-5 hover:border-emerald-500/30 transition-all group bg-white shadow-sm hover:shadow-md">
                           <div className="aspect-square bg-zinc-50 rounded-xl mb-4 relative overflow-hidden border border-zinc-100 flex items-center justify-center">
                              <Image src={getSmartSrc(p.image_url)} alt={p.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-700" unoptimized />
                              {p.stock_quantity !== undefined && p.stock_quantity <= 0 && (
                                 <div className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded">Archived</div>
                              )}
                           </div>
                           <h3 className="text-[11px] font-black uppercase tracking-tight text-zinc-900 mb-1 truncate">{p.name}</h3>
                           <div className="flex items-center justify-between mt-3">
                              <span className="text-sm font-black text-emerald-600">${p.price}</span>
                              <div className="flex items-center gap-1">
                                 <span className="text-[9px] font-bold text-zinc-400 uppercase mr-2">Stock: <span className="text-zinc-900 font-black">{p.stock_quantity || 0}</span></span>
                                 <button onClick={() => openEditor(p)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-black hover:text-white transition-colors text-zinc-500">
                                    <Edit2 className="w-3.5 h-3.5" />
                                 </button>
                                 <button onClick={() => deleteProduct(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-600 hover:text-white transition-colors text-red-500 ml-1">
                                    <Trash2 className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>

      {/* Live Editor Slide-over */}
      <AnimatePresence>
         {isEditorOpen && (
            <>
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setIsEditorOpen(false)}
                 className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
               />
               <motion.div 
                 initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                 className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-zinc-100 z-50 flex flex-col shadow-2xl"
               >
                  <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-white">
                     <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900">
                        {editingProduct.id ? 'Edit Protocol' : 'Initialize Protocol'}
                     </h2>
                     <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                        <X className="w-4 h-4 text-zinc-500" />
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                     <form id="productForm" onSubmit={saveProduct} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Protocol Name</label>
                           <Input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="h-12 bg-zinc-50 border-zinc-200 text-sm font-bold focus:bg-white" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Price (PKR)</label>
                              <Input required type="number" value={editingProduct.price === undefined || isNaN(editingProduct.price as number) ? '' : editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value === "" ? ("" as any) : parseFloat(e.target.value)})} className="h-12 bg-zinc-50 border-zinc-200 text-sm font-bold focus:bg-white" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Stock Level</label>
                              <Input required type="number" value={editingProduct.stock_quantity === undefined || isNaN(editingProduct.stock_quantity) ? '' : editingProduct.stock_quantity} onChange={e => setEditingProduct({...editingProduct, stock_quantity: e.target.value === "" ? ("" as any) : parseInt(e.target.value)})} className="h-12 bg-zinc-50 border-zinc-200 text-sm font-bold focus:bg-white" />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Category</label>
                           <select 
                              required 
                              value={editingProduct.category} 
                              onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                              className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                           >
                              <option value="Tote Bags">Tote Bags</option>
                              <option value="Handbags">Handbags</option>
                              <option value="Backpacks">Backpacks</option>
                              <option value="Shoulder Bags">Shoulder Bags</option>
                              <option value="Clutches">Clutches</option>
                              <option value="Duffle Bags">Duffle Bags</option>
                              <option value="Crossbody">Crossbody</option>
                           </select>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Protocol Type</label>
                           <select 
                             required 
                             value={editingProduct.type || "standard"} 
                             onChange={e => setEditingProduct({...editingProduct, type: e.target.value})}
                             className="w-full h-12 bg-zinc-50 border border-zinc-200 rounded-lg px-4 text-sm font-bold focus:border-emerald-500 focus:bg-white transition-all outline-none"
                           >
                             <option value="standard">Standard Product</option>
                             <option value="usage">Shop By Usage Category</option>
                             <option value="style">Shop By Style Category</option>
                             <option value="bestseller">Bestseller Item</option>
                           </select>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Image Resource</label>
                           <div className="flex gap-2">
                              <div className="relative flex-1">
                                 <Input required value={editingProduct.image_url} onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})} placeholder="Paste URL or upload..." className="h-12 pl-10 bg-zinc-50 border-zinc-200 text-sm font-bold focus:bg-white" />
                                 <ImageIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                              </div>
                              <div className="relative group shrink-0">
                                 <input 
                                   type="file" 
                                   accept="image/*"
                                   onChange={handleImageUpload}
                                   className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" 
                                 />
                                 <Button type="button" disabled={isUploadingImage} className="h-12 px-5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 uppercase tracking-widest text-[9px] font-black transition-all">
                                    {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                 </Button>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Technical Description</label>
                           <Textarea 
                              required 
                              value={editingProduct.description} 
                              onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} 
                              className="min-h-[120px] bg-zinc-50 border-zinc-200 text-sm font-bold focus:bg-white resize-none" 
                           />
                        </div>
                     </form>
                  </div>

                  <div className="p-6 border-t border-zinc-100 bg-zinc-50">
                     <Button type="submit" form="productForm" disabled={isSubmitting} className="w-full h-14 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 shadow-xl transition-all flex items-center justify-center gap-2">
                        {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Protocol</>}
                     </Button>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

// Ensure lucide icon 'Box' is exported/used safely. If not available in lucide-react, I used 'Package'. Box is valid.
