import { motion } from "framer-motion"
import { LogOut, User, Home, Plus, Package } from "lucide-react"
import type { User as UserType } from "../types"

interface HeaderProps {
  user: UserType | null
  currentView: "dashboard" | "add-product" | "inventory"
  onViewChange: (view: "dashboard" | "add-product" | "inventory") => void
  onLogout: () => void
}

export default function Header({ user, currentView, onViewChange, onLogout }: HeaderProps) {
  return (
    <motion.header
      className="bg-white shadow-lg border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Naaree Collections" className="h-12 w-12 rounded-full object-cover" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                Naaree Collections
              </h1>
              <p className="text-xs text-gray-500">Seller Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-2">
              <button
                onClick={() => onViewChange("dashboard")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentView === "dashboard" ? "bg-amber-100 text-amber-700" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => onViewChange("add-product")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentView === "add-product"
                    ? "bg-amber-100 text-amber-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
              <button
                onClick={() => onViewChange("inventory")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentView === "inventory" ? "bg-amber-100 text-amber-700" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Inventory</span>
              </button>
            </nav>

            <div className="flex items-center space-x-4 border-l pl-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>

              <motion.button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
