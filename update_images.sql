-- SQL Snippet to update image_url column to match hyphenated filenames
-- Run this in your Supabase SQL Editor to fix image paths

-- Update Best Sellers
UPDATE products SET image_url = '/images/sell-1.jpeg' WHERE name = 'Custom Printed Bakery Bag';
UPDATE products SET image_url = '/images/sell-2.jpeg' WHERE name = 'Eco-Friendly Grocery Bag';
UPDATE products SET image_url = '/images/sell-3.jpeg' WHERE name = 'Luxury Gift Bag';