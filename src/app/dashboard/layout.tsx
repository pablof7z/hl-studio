import type React from "react"
import { Navigation } from "@/components/layout/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 mx-auto w-full max-w-[1200px] p-6">{children}</main>
    </div>
  )
}
