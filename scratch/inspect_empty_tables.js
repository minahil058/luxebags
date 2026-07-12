const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable(tableName, dummyRow, uniqueField, uniqueVal) {
  console.log(`\nInspecting table "${tableName}"...`);
  const { data: insertData, error: insertError } = await supabase.from(tableName).insert([dummyRow]).select();
  if (insertError) {
    console.error(`Error inserting into "${tableName}":`, insertError.message || insertError);
    return;
  }
  console.log(`Successfully inserted. Row columns:`, Object.keys(insertData[0]));
  console.log(`Full row data:`, insertData[0]);

  // Clean up
  const { error: deleteError } = await supabase.from(tableName).delete().eq(uniqueField, uniqueVal);
  if (deleteError) {
    console.error(`Error deleting from "${tableName}":`, deleteError.message || deleteError);
  } else {
    console.log(`Cleaned up temporary row from "${tableName}".`);
  }
}

async function run() {
  await inspectTable(
    'requests',
    { name: 'Temp Requester', email: 'temp@example.com', requirements: 'Temp requirements' },
    'email',
    'temp@example.com'
  );

  await inspectTable(
    'subscribers',
    { email: 'temp_sub@example.com' },
    'email',
    'temp_sub@example.com'
  );
}

run();
