import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Product, User, DashboardStats } from "../types"

interface DashboardState {
  user: User | null
  products: Product[]
  stats: DashboardStats
  isAuthenticated: boolean
  currentView: "dashboard" | "add-product" | "inventory"
}

type DashboardAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "SET_VIEW"; payload: "dashboard" | "add-product" | "inventory" }
  | { type: "LOGOUT" }

const initialState: DashboardState = {
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

const DashboardContext = createContext<{
  state: DashboardState
  dispatch: React.Dispatch<DashboardAction>
} | null>(null)

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      }

    case "SET_PRODUCTS":
      const products = action.payload
      const stats = {
        totalProducts: products.length,
        inStockProducts: products.filter((p) => p.availability === "In Stock").length,
        outOfStockProducts: products.filter((p) => p.availability === "Out of Stock").length,
        limitedStockProducts: products.filter((p) => p.availability === "Limited").length,
      }
      return {
        ...state,
        products,
        stats,
      }

    case "ADD_PRODUCT":
      const newProducts = [...state.products, action.payload]
      return {
        ...state,
        products: newProducts,
        stats: {
          totalProducts: newProducts.length,
          inStockProducts: newProducts.filter((p) => p.availability === "In Stock").length,
          outOfStockProducts: newProducts.filter((p) => p.availability === "Out of Stock").length,
          limitedStockProducts: newProducts.filter((p) => p.availability === "Limited").length,
        },
      }

    case "UPDATE_PRODUCT":
      const updatedProducts = state.products.map((p) => (p.id === action.payload.id ? action.payload : p))
      return {
        ...state,
        products: updatedProducts,
        stats: {
          totalProducts: updatedProducts.length,
          inStockProducts: updatedProducts.filter((p) => p.availability === "In Stock").length,
          outOfStockProducts: updatedProducts.filter((p) => p.availability === "Out of Stock").length,
          limitedStockProducts: updatedProducts.filter((p) => p.availability === "Limited").length,
        },
      }

    case "DELETE_PRODUCT":
      const filteredProducts = state.products.filter((p) => p.id !== action.payload)
      return {
        ...state,
        products: filteredProducts,
        stats: {
          totalProducts: filteredProducts.length,
          inStockProducts: filteredProducts.filter((p) => p.availability === "In Stock").length,
          outOfStockProducts: filteredProducts.filter((p) => p.availability === "Out of Stock").length,
          limitedStockProducts: filteredProducts.filter((p) => p.availability === "Limited").length,
        },
      }

    case "SET_VIEW":
      return { ...state, currentView: action.payload }

    case "LOGOUT":
      return initialState

    default:
      return state
  }
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  return <DashboardContext.Provider value={{ state, dispatch }}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider")
  }
  return context
}
