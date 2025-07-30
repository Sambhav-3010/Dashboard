"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Package, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { useDashboard } from "./dashboard-provider"
import { StatsCard } from "./stats-card"

const mockProducts = [
  {
    id: "1",
    name: "Elegant Silk Saree",
    price: 2999,
    originalPrice: 3999,
    image: "https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "saree" as const,
    description: "Beautiful handwoven silk saree with intricate golden border",
    sizes: ["Free Size"],
    colors: ["Red", "Green", "Pink"],
    inStock: true,
    trending: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Designer Cotton Saree",
    price: 1599,
    originalPrice: 2199,
    image: "https://images.pexels.com/photos/9558618/pexels-photo-9558618.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "saree" as const,
    description: "Comfortable cotton saree perfect for daily wear",
    sizes: ["Free Size"],
    colors: ["White", "Cream", "Light Blue"],
    inStock: false,
    trending: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
]

export function Dashboard() {
  const { state, dispatch } = useDashboard()

  useEffect(() => {
    dispatch({ type: "SET_PRODUCTS", payload: mockProducts })
  }, [dispatch])

  const statsData = [
    {
      title: "Total Products",
      value: state.stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "In Stock",
      value: state.stats.inStockProducts,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Out of Stock",
      value: state.stats.outOfStockProducts,
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      title: "Trending",
      value: state.stats.trendingProducts,
      icon: TrendingUp,
      color: "bg-amber-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {state.user?.name}!</h1>
          <p className="text-gray-600">{"Here's an overview of your product inventory"}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              index={index}
            />
          ))}
        </div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              className="p-4 border-2 border-dashed border-amber-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all duration-200 text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Package className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Add New Product</p>
              <p className="text-sm text-gray-600">Create a new product listing</p>
            </motion.button>

            <motion.button
              className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Manage Trending</p>
              <p className="text-sm text-gray-600">Update trending products</p>
            </motion.button>

            <motion.button
              className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Update Inventory</p>
              <p className="text-sm text-gray-600">Manage stock levels</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
