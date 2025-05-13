import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RecommendationsContent } from "@/components/recommendations/recommendations-content"

export const metadata: Metadata = {
  title: "Recommendations | Highlighter",
  description: "Manage your recommendations on Highlighter",
}

export default function RecommendationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Recommendations"
        text="Recommend other publications to your subscribers"
        showNewPostButton={false}
      />
      <RecommendationsContent />
    </DashboardShell>
  )
}
