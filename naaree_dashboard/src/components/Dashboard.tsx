
import { motion } from "framer-motion"
import { Package, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import StatsCard from "./StatsCard"
import type { DashboardStats, User } from "../types"

interface DashboardProps {
  stats: DashboardStats
  user?: User | null
  onViewChange: (view: "dashboard" | "add-product" | "inventory") => void
}

export default function Dashboard({ stats, user, onViewChange }: DashboardProps) {
  const statsData = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "In Stock",
      value: stats.inStockProducts,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockProducts,
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      title: "Limited Stock",
      value: stats.limitedStockProducts,
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Here's an overview of your product inventory</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              onClick={() => onViewChange("add-product")}
              className="p-4 border-2 border-dashed border-amber-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all duration-200 text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Package className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Add New Product</p>
              <p className="text-sm text-gray-600">Create a new product listing</p>
            </motion.button>

            <motion.button
              onClick={() => onViewChange("inventory")}
              className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Manage Inventory</p>
              <p className="text-sm text-gray-600">Update product listings</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
