'use client';

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentPosts } from "@/components/dashboard/recent-posts"
import { SubscriberGrowth } from "@/components/dashboard/subscriber-growth"
import { TopPerformers } from "@/components/dashboard/top-performers"
import { UpcomingSchedule } from "@/components/dashboard/upcoming-schedule"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your Highlighter publication" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <SubscriberGrowth className="lg:col-span-4" />
        <TopPerformers className="lg:col-span-3" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <RecentPosts />
        <UpcomingSchedule />
      </div>
    </DashboardShell>
  )
}
