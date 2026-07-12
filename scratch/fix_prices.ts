import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Normalized prices for all Supabase products
const PRICE_UPDATES = [
  { name_match: 'heavy', price: 75 },
  { name_match: 'medical', price: 60 },
  { name_match: 'bakery', price: 45 },
  { name_match: 'grocery', price: 35 },
  { name_match: 'gift', price: 55 },
  { name_match: 'storage', price: 65 },
  { name_match: 'giveaway', price: 30 },
  { name_match: 'promotional', price: 30 },
  { name_match: 'd-cut', price: 50 },
  { name_match: 'handled', price: 40 },
  { name_match: 'laundry', price: 38 },
  { name_match: 'marketing', price: 35 },
  { name_match: 'retail', price: 40 },
]

async function fixPrices() {
  const { data: products, error } = await supabase.from('products').select('id, name, price')
  if (error) { console.error(error); return }

  console.log('Current products:')
  products?.forEach(p => console.log(`  ${p.name}: ${p.price}`))

  for (const product of products || []) {
    const nameLower = product.name.toLowerCase()
    const match = PRICE_UPDATES.find(u => nameLower.includes(u.name_match))
    const newPrice = match ? match.price : 50 // default $50 if no match

    const { error: updateErr } = await supabase
      .from('products')
      .update({ price: newPrice })
      .eq('id', product.id)

    if (updateErr) {
      console.error(`Failed to update ${product.name}:`, updateErr.message)
    } else {
      console.log(`✓ Updated ${product.name}: $${newPrice}.00`)
    }
  }

  console.log('\nAll prices normalized!')
}

fixPrices()
