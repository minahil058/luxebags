import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase env vars missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, type, category, image_url')
  
  if (error) {
    console.error('Error fetching products:', error)
    return
  }

  console.log('--- ALL PRODUCTS ---')
  console.table(data)
  
  const usage = data?.filter(p => p.type === 'usage')
  console.log('\n--- USAGE PRODUCTS ---')
  console.table(usage)
}

checkProducts()
