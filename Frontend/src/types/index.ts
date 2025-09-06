export interface Product {
  _id: string
  name: string
  fabricType: string
  regionalVarieties: string
  price: number
  discounts: number
  sizes: string[]
  availability: "In Stock" | "Out of Stock" | "Limited"
  productType: "saree" | "suits" | "boutique-fabrics" | "accessories"
  shortDescription: string
  images: string[]
  createdAt: Date
  updatedAt: Date
  quantity: number
  instagramLink?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "seller" | "admin"
}

export interface DashboardStats {
  totalProducts: number
  inStockProducts: number
  outOfStockProducts: number
  limitedStockProducts: number
}
