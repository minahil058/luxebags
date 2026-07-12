"use server";

import { supabase } from "./supabase";
import { Product } from "@/types";

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // Avoid logging empty objects, check if it's a real error
      if (Object.keys(error).length > 0) {
        console.error("Supabase Error [getProducts]:", error.message || error);
      } else if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Silently fail if we know Supabase isn't configured, fallbacks will handle it
      } else {
        console.warn("Product fetch returned empty error but no data.");
      }
      return [];
    }

    return data as Product[];
  } catch (err) {
    console.error("Unexpected error:", err);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null;

  // Handle simulation IDs
  if (id.startsWith("sim-")) {
    const index = parseInt(id.split("-")[1]);
    return {
      id: id,
      name: `Professional Bag Series ${index + 1}`,
      price: `$${(2.78 + (index * 0.5)).toFixed(2)}`,
      category: "Tote Bags",
      image_url: `/images/product-${(index % 15) + 1}.webp`,
      description: "Give carriage the class and durability it deserves with these premium bags. Spacious and flexible by nature, perfect for heavy loads.",
      type: "simulation"
    } as any;
  }

  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    let query = supabase.from("products").select("*");
    
    if (uuidRegex.test(id)) {
      query = query.eq("id", id);
    } else {
      // Try name case-insensitively if not UUID
      query = query.ilike("name", id);
    }

    const { data, error } = await query.single();

    if (error) {
      if (Object.keys(error).length > 0 && error.code !== 'PGRST116') { // PGRST116 is 'not found' which is common
        console.error("Supabase Error [getProductById]:", error.message || error);
      }
      return null;
    }

    return data as Product;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
}
