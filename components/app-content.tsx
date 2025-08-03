"use client"

import { useDashboard } from "./dashboard-provider"
import { Header } from "./header"
import { Login } from "./login"
import { Dashboard } from "./dashboard"

export function AppContent() {
  const { state } = useDashboard()

  if (!state.isAuthenticated) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Dashboard />
    </div>
  )
}
