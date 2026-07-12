import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

console.log("Initializing useProductStore...");

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image_url: string;
  images?: string[];
  type: string;
  featured?: boolean;
  bestseller?: boolean;
}

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

const fallbackProducts: Product[] = [
  // Bestsellers
  { id: 'f-1', name: 'Premium Signature Tote', price: '$45.00', category: 'Luxury', image_url: '/images/sell-1.jpeg', type: 'best_seller', bestseller: true },
  { id: 'f-2', name: 'Eco-Friendly Grocery Bag', price: '$35.00', category: 'Retail', image_url: '/images/sell-2.jpeg', type: 'best_seller', bestseller: true },
  { id: 'f-3', name: 'Luxury Gift Bag', price: '$55.00', category: 'Events', image_url: '/images/sell-3.jpeg', type: 'best_seller', bestseller: true },
  { id: 'f-4', name: 'Industrial Storage Tote', price: '$65.00', category: 'Industrial', image_url: '/images/sell-4.jpeg', type: 'best_seller', bestseller: true },
  { id: 'f-5', name: 'Promotional Giveaway Bag', price: '$30.00', category: 'Marketing', image_url: '/images/sell-5.jpeg', type: 'best_seller', bestseller: true },
  
  // Usage Categories
  { id: 'f-6', name: 'Chemical Industrial', price: '$75.00', category: 'Industrial', image_url: '/images/shop-1.avif', type: 'usage' },
  { id: 'f-7', name: 'Medical Supply', price: '$60.00', category: 'Healthcare', image_url: '/images/shop-2.avif', type: 'usage' },
  { id: 'f-8', name: 'Retail Packaging', price: '$40.00', category: 'Retail', image_url: '/images/shop-3.avif', type: 'usage' },
  { id: 'f-9', name: 'Agricultural Feed', price: '$50.00', category: 'Agriculture', image_url: '/images/shop-4.avif', type: 'usage' },
  { id: 'f-10', name: 'Marketing Tote', price: '$35.00', category: 'Marketing', image_url: '/images/shop-5.avif', type: 'usage' },
  
  // Featured
  { id: 'f-11', name: 'Onyx Series D-Cut', price: '$55.00', category: 'Luxury', image_url: '/images/feature-1.jpeg', type: 'Industrial', featured: true },
  { id: 'f-12', name: 'Veridian Eco-Loop', price: '$45.00', category: 'Eco', image_url: '/images/feature-2.jpeg', type: 'Industrial', featured: true },
  { id: 'f-13', name: 'Titan Industrial Series', price: '$70.00', category: 'Heavy Duty', image_url: '/images/feature-3.jpeg', type: 'Industrial', featured: true },
  { id: 'f-14', name: 'Elite Canvas Protocol', price: '$60.00', category: 'Bespoke', image_url: '/images/feature-4.jpeg', type: 'Industrial', featured: true },
  { id: 'f-15', name: 'Midnight Cargo Unit', price: '$65.00', category: 'Logistics', image_url: '/images/feature-5.jpeg', type: 'Industrial', featured: true },
];

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    console.log("Fetching products from Supabase...");
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      
      console.log("Supabase Data Received:", data);

      if (data && data.length > 0) {
        // Intelligent Merge: Use Supabase data, but keep fallbacks for categories that are empty in the DB
        const usageInDb = data.filter(p => p.type === 'usage');
        const hasBestsellers = data.some(p => p.bestseller || p.type === 'best_seller');
        const hasFeatured = data.some(p => p.featured);

        let mergedProducts = [...data];
        
        if (!hasBestsellers) mergedProducts = [...mergedProducts, ...fallbackProducts.filter(p => p.bestseller)];
        if (!hasFeatured) mergedProducts = [...mergedProducts, ...fallbackProducts.filter(p => p.featured)];
        
        // Always ensure at least the core 5 usage categories are present
        if (usageInDb.length < 5) {
          const missingUsage = fallbackProducts.filter(fp => 
            fp.type === 'usage' && !usageInDb.some(db => db.name.toLowerCase().includes(fp.name.toLowerCase().split(' ')[0]))
          );
          mergedProducts = [...mergedProducts, ...missingUsage];
        }

        // Deduplicate by ID just in case
        const uniqueProducts = Array.from(new Map(mergedProducts.map(p => [p.id, p])).values());
        
        set({ products: uniqueProducts, isLoading: false });
      } else {
        console.log("No data in Supabase, using full fallback...");
        set({ products: fallbackProducts, isLoading: false });
      }
    } catch (err: any) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isPlaceholderUrl = !supabaseUrl || supabaseUrl.includes("placeholder.supabase.co");
      const isFetchError = err?.message?.toLowerCase().includes("failed to fetch") || 
                           err?.toString()?.toLowerCase().includes("failed to fetch");

      if (isPlaceholderUrl) {
        console.warn("[Product Store] Using local development fallback mode. Configure NEXT_PUBLIC_SUPABASE_URL in .env.local to connect to live Supabase.");
      } else if (isFetchError) {
        console.warn("[Product Store] Supabase fetch failed. This usually means the Supabase project domain cannot be resolved (e.g. project paused or deleted by Supabase). Falling back to offline mockup data.");
      } else {
        console.error("Supabase Store Error:", err?.message || err);
      }
      
      // Set error to null to allow UI to render fallbackProducts without showing error screens
      set({ error: null, products: fallbackProducts, isLoading: false });
    }
  },
}));
