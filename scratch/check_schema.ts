import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

async function checkSchema() {
  const { data, error } = await supabase.from('products').select('*').limit(1)
  if (error) {
    console.error(error)
  } else {
    console.log('Columns in products table:', Object.keys(data[0] || {}))
  }
}

checkSchema()
