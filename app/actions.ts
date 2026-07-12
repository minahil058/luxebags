"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Submit a Sample, Custom, or Quote Request
export async function submitRequest(formData: {
  name: string;
  email: string;
  phone?: string;
  quantity?: string;
  requirements?: string;
  type: "sample" | "custom" | "quote";
}) {
  try {
    const { name, email, phone, quantity, requirements, type } = formData;
    
    // Construct a comprehensive requirements string to avoid schema errors
    // while preserving all procurement data.
    const consolidatedRequirements = [
      `TYPE: ${type.toUpperCase()}`,
      `QUANTITY: ${quantity || 'NOT SPECIFIED'}`,
      `PHONE: ${phone || 'NOT PROVIDED'}`,
      requirements ? `ADDITIONAL INFO: ${requirements}` : ""
    ].filter(Boolean).join(" | ");

    // Insert only into columns we are certain exist in the schema
    const { error } = await supabase.from("requests").insert([{ 
      name, 
      email, 
      requirements: consolidatedRequirements
    }]);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Submission Error:", err);
    return { success: false, error: err.message };
  }
}

// Subscribe to Newsletter
export async function subscribeToNewsletter(email: string) {
  try {
    if (!email || !email.includes("@")) {
      throw new Error("Invalid email address");
    }

    const { error } = await supabase.from("subscribers").insert([{ email }]);
    if (error) {
      if (error.code === "23505") {
        throw new Error("You are already subscribed!");
      }
      throw error;
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Fetch Reviews
export async function getReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) return [];
  return data;
}
