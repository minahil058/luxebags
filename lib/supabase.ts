import { createClient } from '@supabase/supabase-js'

// Default values de dein taake build time par crash na ho
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24ifQ.placeholder_signature_validation_string').trim();

if (!supabaseUrl) {
    console.error("ALERT: Supabase URL missing in .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)