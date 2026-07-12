const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log("Testing review insert...");
  const newReview = {
    name: "Test User",
    rating: 5,
    review: "This is a test review to check nullability of other columns.",
    is_verified: true
  };
  const { data, error } = await supabase.from('reviews').insert([newReview]).select();
  if (error) {
    console.error("Error inserting review:", error.message || error);
  } else {
    console.log("Success! Inserted row:", data);
    // Delete the test row to clean up
    if (data && data[0]) {
      const { error: deleteError } = await supabase.from('reviews').delete().eq('id', data[0].id);
      if (deleteError) {
        console.error("Error cleaning up test row:", deleteError);
      } else {
        console.log("Cleaned up test row successfully.");
      }
    }
  }
}

testInsert();
