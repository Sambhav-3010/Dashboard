"use client"

import { DashboardProvider } from "@/components/dashboard-provider"
import { AppContent } from "@/components/app-content"

export default function Home() {
  return (
    <DashboardProvider>
      <AppContent />
    </DashboardProvider>
  )
}
