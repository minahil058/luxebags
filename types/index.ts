export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  image_url: string;
  images?: string[];
  category: string;
  stock_quantity?: number;
  type?: string;
}
