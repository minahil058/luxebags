import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

async function tryUpdate() {
  const { data, error } = await supabase
    .from('products')
    .update({ name: 'UPDATED TEST' })
    .eq('id', 'c53f06af-da11-427a-b8f6-c09c35725c8f')
    .select()

  if (error) {
    console.error('Update failed:', error)
  } else {
    console.log('Update success:', data)
  }
}

tryUpdate()
