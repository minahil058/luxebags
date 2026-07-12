const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTable(tableName) {
  console.log(`\nTesting table "${tableName}"...`);
  try {
    const { data, error } = await supabase.from(tableName).select('*').limit(1);
    if (error) {
      console.error(`Error querying "${tableName}":`, error.message || error);
    } else {
      console.log(`Success querying "${tableName}"!`);
      if (data && data.length > 0) {
        console.log(`Columns in "${tableName}":`, Object.keys(data[0]));
      } else {
        console.log(`Table "${tableName}" is empty (but exists).`);
      }
    }
  } catch (err) {
    console.error(`Unexpected exception for "${tableName}":`, err.message || err);
  }
}

async function run() {
  const tables = ['products', 'orders', 'requests', 'subscribers', 'reviews'];
  for (const table of tables) {
    await testTable(table);
  }
}

run();
