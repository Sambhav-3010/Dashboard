import { DashboardProvider, useDashboard } from "./context/DashboardContext"
import Header from "./components/Header"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import AddProductForm from "./components/AddProductForm"
import InventoryManagement from "./components/InventoryManagement"

function AppContent() {
  const { state } = useDashboard()

  if (!state.isAuthenticated) {
    return <Login />
  }

  const renderCurrentView = () => {
    switch (state.currentView) {
      case "add-product":
        return <AddProductForm />
      case "inventory":
        return <InventoryManagement />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">{renderCurrentView()}</div>
    </div>
  )
}

function App() {
  return (
    <DashboardProvider>
      <AppContent />
    </DashboardProvider>
  )
}

export default App
