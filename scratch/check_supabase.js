const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  console.log("Fetching products from Supabase...");
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  console.log(`Found ${data.length} products:`);
  data.forEach(p => {
    console.log(`- ID: ${p.id}, Name: "${p.name}", Image URL: "${p.image_url}"`);
  });
}

checkProducts();
