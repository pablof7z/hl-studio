import type React from "react"
import { SettingsSidebar } from "@/components/settings/settings-sidebar"
import { Toaster } from "@/components/ui/use-toast"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Toaster>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[250px]">
          <SettingsSidebar />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
    </Toaster>
  )
}
