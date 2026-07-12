import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

const PRODUCTS = [
  // USAGE SECTION (5 Items)
  { name: 'Industrial Chemical Bag', type: 'usage', category: 'Industrial', image_url: '/images/shop1.avif', price: 45.00, description: 'Heavy-duty non-woven unit.' },
  { name: 'Medical Supply Carrier', type: 'usage', category: 'Healthcare', image_url: '/images/shop 2.avif', price: 38.00, description: 'Sterile healthcare logistics.' },
  { name: 'Laundry Management Tote', type: 'usage', category: 'Services', image_url: '/images/shop 3.avif', price: 22.00, description: 'Bulk service management.' },
  { name: 'Marketing Giveaway Bag', type: 'usage', category: 'Marketing', image_url: '/images/shop 4.avif', price: 18.00, description: 'High-impact brand exposure.' },
  { name: 'Grocery Retail Unit', type: 'usage', category: 'Retail', image_url: '/images/shop 5.avif', price: 12.00, description: 'Eco-friendly retail solution.' },

  // BEST SELLERS (5 Items)
  { name: 'Premium Bakery Tote', type: 'best_seller', category: 'Food', image_url: '/images/sell 1.jpeg', price: 25.00, description: 'Best-selling bakery unit.' },
  { name: 'Organic Cotton Grocery', type: 'best_seller', category: 'Retail', image_url: '/images/sell 2.jpeg', price: 15.00, description: 'Premium eco-grocery bag.' },
  { name: 'Luxury Event Gift Bag', type: 'best_seller', category: 'Events', image_url: '/images/sell 3.jpeg', price: 45.00, description: 'High-end gift packaging.' },
  { name: 'Heavy Duty Storage', type: 'best_seller', category: 'Industrial', image_url: '/images/sell 4.jpeg', price: 55.00, description: 'Maximum durability tote.' },
  { name: 'Corporate Branding Bag', type: 'best_seller', category: 'Corporate', image_url: '/images/sell 5.jpeg', price: 20.00, description: 'Corporate identity manifest.' },

  // STYLE CATEGORIES (4 Items)
  { name: 'D-Cut Silhouette', type: 'style', category: 'Style', image_url: '/images/style 1.jpeg', price: 10.00, description: 'Classic D-cut architecture.' },
  { name: 'Loop Handle Classic', type: 'style', category: 'Style', image_url: '/images/style 2.jpeg', price: 14.00, description: 'Reinforced loop handles.' },
  { name: 'Boxed Gusset Tote', type: 'style', category: 'Style', image_url: '/images/style 3.jpeg', price: 18.00, description: 'Maximum volume box design.' },
  { name: 'Shoulder Strap Utility', type: 'style', category: 'Style', image_url: '/images/style 4.jpeg', price: 22.00, description: 'Extended carry comfort.' }
]

async function seed() {
  console.log('Cleaning existing products...')
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('Seeding new inventory...')
  const { error } = await supabase.from('products').insert(PRODUCTS)
  
  if (error) {
    console.error('Seeding failed:', error)
  } else {
    console.log('Inventory successfully restored!')
  }
}

seed()
