const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testFlow() {
  console.log("=== Testing Review Fetching Logic ===");
  try {
    const { data: dbReviews, error: fetchError } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) throw fetchError;

    console.log(`Fetched ${dbReviews.length} reviews from live DB.`);
    if (dbReviews.length > 0) {
      console.log("Sample review row from DB:", dbReviews[0]);
      
      // Simulate the UI mapping logic:
      const mapped = dbReviews.map((rev) => ({
        id: rev.id,
        user_name: rev.name || rev.user_name || "Anonymous",
        rating: rev.rating || 5,
        comment: rev.review || rev.comment || "",
        created_at: rev.created_at,
        verified_purchase: rev.is_verified ?? rev.verified_purchase ?? false
      }));
      console.log("Mapped review object for UI:", mapped[0]);
    } else {
      console.log("Database has 0 reviews. Mappings will use fallback matrix.");
    }

    console.log("\n=== Testing Review Insertion Logic ===");
    // Simulating insert with the exact keys used in page.tsx
    const testReview = {
      name: "Audit Test Robot",
      rating: 5,
      review: "Thermal handles payload support and print branding symmetry are pristine. Verification successful.",
      is_verified: true,
      user_email: "audit@test.com"
    };

    console.log("Inserting review:", testReview);
    const { data: inserted, error: insertError } = await supabase
      .from("reviews")
      .insert([testReview])
      .select();

    if (insertError) throw insertError;

    console.log("Success! Inserted review row:", inserted);

    // Clean up test review
    console.log("\n=== Cleaning Up Test Review ===");
    const { error: deleteError } = await supabase
      .from("reviews")
      .delete()
      .eq("id", inserted[0].id);

    if (deleteError) throw deleteError;
    console.log("Cleaned up temporary review successfully.");
    console.log("\n=== ALL FLOW TESTS PASSED SUCCESSFULLY ===");

  } catch (err) {
    console.error("Test Flow Failed with Error:", err.message || err);
    process.exit(1);
  }
}

testFlow();
