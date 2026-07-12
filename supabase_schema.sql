-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  type TEXT NOT NULL, -- 'best_seller', 'usage', 'featured', 'style'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
