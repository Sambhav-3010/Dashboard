export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'saree' | 'suits' | 'boutique-fabrics' | 'accessories';
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  trending?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'seller';
}

export interface DashboardStats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  trendingProducts: number;
}