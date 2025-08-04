import { useEffect, useState } from "react"
import Header from "./components/Header"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import AddProductForm from "./components/AddProductForm"
import InventoryManagement from "./components/InventoryManagement"
import { getAuthFromStorage, saveAuthToStorage, clearAuthFromStorage } from "./utils/auth"
import type { Product, User, DashboardStats } from "./types"

interface AppState {
  user: User | null
  products: Product[]
  stats: DashboardStats
  isAuthenticated: boolean
  currentView: "dashboard" | "add-product" | "inventory"
}

const initialState: AppState = {
  user: null,
  products: [],
  stats: {
    totalProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
    limitedStockProducts: 0,
  },
  isAuthenticated: false,
  currentView: "dashboard",
}

function App() {
  const [state, setState] = useState<AppState>(initialState)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing authentication on app load
  useEffect(() => {
    const savedUser = getAuthFromStorage()
    if (savedUser) {
      setState(prev => ({
        ...prev,
        user: savedUser,
        isAuthenticated: true,
      }))
    }
    setIsLoading(false)
  }, [])

  // Fetch products from backend
  useEffect(() => {
    if (state.isAuthenticated) {
      fetch(`${import.meta.env.VITE_API_URL}/products`)
        .then((res) => res.json())
        .then((data: Product[]) => {
          setProducts(data)
        })
        .catch((err) => {
          console.error("Failed to fetch products", err)
        })
    }
  }, [state.isAuthenticated])

  const setUser = (user: User | null) => {
    if (user) {
      saveAuthToStorage(user)
    } else {
      clearAuthFromStorage()
    }
    
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
    }))
  }

  const setProducts = (products: Product[]) => {
    const stats = {
      totalProducts: products.length,
      inStockProducts: products.filter((p) => p.availability === "In Stock").length,
      outOfStockProducts: products.filter((p) => p.availability === "Out of Stock").length,
      limitedStockProducts: products.filter((p) => p.availability === "Limited").length,
    }
    setState(prev => ({
      ...prev,
      products,
      stats,
    }))
  }

  const addProduct = (product: Product) => {
    const newProducts = [...state.products, product]
    setProducts(newProducts)
  }

  const updateProduct = (product: Product) => {
    const updatedProducts = state.products.map((p) => (p._id === product._id ? product : p))
    setProducts(updatedProducts)
  }

  const deleteProduct = (productId: string) => {
    const filteredProducts = state.products.filter((p) => p._id !== productId)
    setProducts(filteredProducts)
  }

  const setView = (view: "dashboard" | "add-product" | "inventory") => {
    setState(prev => ({ ...prev, currentView: view }))
  }

  const logout = () => {
    clearAuthFromStorage()
    setState(initialState)
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!state.isAuthenticated) {
    return <Login onLogin={setUser} />
  }

  const renderCurrentView = () => {
    switch (state.currentView) {
      case "add-product":
        return (
          <AddProductForm 
            onProductAdded={addProduct}
            onViewChange={setView}
          />
        )
      case "inventory":
        return (
          <InventoryManagement 
            products={state.products}
            onProductUpdate={updateProduct}
            onProductDelete={deleteProduct}
            onViewChange={setView}
          />
        )
      default:
        return (
          <Dashboard 
            stats={state.stats}
            onViewChange={setView}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={state.user}
        currentView={state.currentView}
        onViewChange={setView}
        onLogout={logout}
      />
      <div className="container mx-auto px-4 py-8">{renderCurrentView()}</div>
    </div>
  )
}

export default App