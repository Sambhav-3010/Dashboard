import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AddProductForm from "./components/AddProductForm";
import InventoryManagement from "./components/InventoryManagement";
import UserList from "./pages/UserList"; // Import UserList component
import OrderList from "./pages/OrderList"; // Import OrderList component

import {
  getAuthFromStorage,
  saveAuthToStorage,
  clearAuthFromStorage,
} from "./utils/auth";
import type { Product, User, DashboardStats } from "./types";

interface AppState {
  user: User | null;
  products: Product[];
  stats: DashboardStats;
  isAuthenticated: boolean;
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
};

function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = () => {
    if (state.isAuthenticated) {
      fetch(`${import.meta.env.VITE_API_URL}/products`)
        .then((res) => res.json())
        .then((data: Product[]) => {
          setProducts(data);
        })
        .catch((err) => {
          console.error("Failed to fetch products", err);
        });
    }
  };

  // Check for existing authentication on app load
  useEffect(() => {
    const savedUser = getAuthFromStorage();
    if (savedUser) {
      setState((prev) => ({
        ...prev,
        user: savedUser,
        isAuthenticated: true,
      }));
    }
    setIsLoading(false);
  }, []);

  // Fetch products from backend
  useEffect(() => {
    if (state.isAuthenticated) {
      fetchProducts();
    }
  }, [state.isAuthenticated]);

  const setUser = (user: User | null) => {
    if (user) {
      saveAuthToStorage(user);
    } else {
      clearAuthFromStorage();
    }

    setState((prev) => ({
      ...prev,
      user,
      isAuthenticated: !!user,
    }));
  };

  const setProducts = (products: Product[]) => {
    const stats = {
      totalProducts: products.length,
      inStockProducts: products.filter((p) => p.availability === "In Stock")
        .length,
      outOfStockProducts: products.filter(
        (p) => p.availability === "Out of Stock"
      ).length,
      limitedStockProducts: products.filter((p) => p.availability === "Limited")
        .length,
    };
    setState((prev) => ({
      ...prev,
      products,
      stats,
    }));
  };

  const addProduct = (product: Product) => {
    const newProducts = [...state.products, product];
    setProducts(newProducts);
  };

  const updateProduct = (product: Product) => {
    const updatedProducts = state.products.map((p) =>
      p._id === product._id ? product : p
    );
    setProducts(updatedProducts);
  };

  const deleteProduct = (productId: string) => {
    const filteredProducts = state.products.filter((p) => p._id !== productId);
    setProducts(filteredProducts);
  };

  const logout = () => {
    clearAuthFromStorage();
    setState(initialState);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {!state.isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <Header user={state.user} onLogout={logout} />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    stats={state.stats}
                    user={state.user}
                  />
                }
              />
              <Route
                path="/add-product"
                element={<AddProductForm onProductAdded={addProduct} />}
              />
              <Route
                path="/inventory"
                element={
                  <InventoryManagement
                    products={state.products}
                    onProductUpdate={updateProduct}
                    onProductDelete={deleteProduct}
                    fetchProducts={fetchProducts}
                  />
                }
              />
              {/* User Management Route */}
              <Route path="/users" element={<UserList />} />
              {/* Order Management Route */}
              <Route path="/orders" element={<OrderList />} />
              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
