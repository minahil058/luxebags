import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSmartSrc = (url: any) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return "/images/product 1.webp";
  }
  
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return encodeURI(trimmed);
  }
  
  // Clean up paths to exactly match physical file names on disk with spaces
  let cleanUrl = trimmed.replace(/\/+/g, '/');
  
  // Auto-map common hyphenated requests to actual spaced disk files
  cleanUrl = cleanUrl
    .replace(/\/images\/product-(\d+)\.webp/i, '/images/product $1.webp')
    .replace(/\/images\/feature-(\d+)\.jpeg/i, '/images/feature $1.jpeg')
    .replace(/\/images\/sell-(\d+)\.jpeg/i, '/images/sell $1.jpeg')
    .replace(/\/images\/style-(\d+)\.jpeg/i, '/images/style $1.jpeg')
    .replace(/\/images\/bag-(\d+)\.jpeg/i, '/images/bag $1.jpeg')
    .replace(/\/images\/shop-1\.avif/i, '/images/shop1.avif')
    .replace(/\/images\/shop-(\d+)\.avif/i, '/images/shop $1.avif');
    
  // Ensure absolute path prefix
  if (!cleanUrl.startsWith('/')) {
    cleanUrl = '/' + cleanUrl;
  }
  
  return encodeURI(cleanUrl);
};
