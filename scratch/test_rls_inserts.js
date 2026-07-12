const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Testing plain insert into requests...");
  const reqRes = await supabase.from("requests").insert([{
    name: 'Temp Requester',
    email: 'temp@example.com',
    requirements: 'Temp requirements'
  }]);
  console.log("requests insert result:", reqRes.error ? `Failed: ${reqRes.error.message}` : "Success!");

  console.log("Testing plain insert into subscribers...");
  const subRes = await supabase.from("subscribers").insert([{
    email: 'temp_sub@example.com'
  }]);
  console.log("subscribers insert result:", subRes.error ? `Failed: ${subRes.error.message}` : "Success!");

  // Try to clean them up (might fail due to select/delete RLS, but let's try)
  const delReq = await supabase.from("requests").delete().eq('email', 'temp@example.com');
  console.log("requests delete result:", delReq.error ? `Failed: ${delReq.error.message}` : "Success!");
  
  const delSub = await supabase.from("subscribers").delete().eq('email', 'temp_sub@example.com');
  console.log("subscribers delete result:", delSub.error ? `Failed: ${delSub.error.message}` : "Success!");
}

run();
