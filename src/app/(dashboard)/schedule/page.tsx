import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const metadata: Metadata = {
  title: "Content Calendar | Highlighter",
  description: "Manage your content schedule on Highlighter",
}

export default function SchedulePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Content Calendar" text="Visualize and manage your content schedule" />
    </DashboardShell>
  )
}
