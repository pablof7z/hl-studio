import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ImportExportTabs } from "@/components/posts/import-export/import-export-tabs"

export const metadata: Metadata = {
  title: "Import/Export | Highlighter",
  description: "Import and export your content on Highlighter",
}

export default function ImportExportPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Import/Export" text="Transfer your content to and from Highlighter" />
      <ImportExportTabs />
    </DashboardShell>
  )
}
