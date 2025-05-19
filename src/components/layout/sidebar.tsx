"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart2, BookOpen, Calendar, FileText, Home, Settings, ThumbsUp, Users, Zap } from "lucide-react"
import { PostTypeDropdown } from "@/components/posts/post-type-dropdown"

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      title: "Posts",
      href: "/posts",
      icon: FileText,
    },
    {
      title: "Schedule",
      href: "/schedule",
      icon: Calendar,
    },
    {
      title: "Subscribers",
      href: "/subscribers",
      icon: Users,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart2,
    },
    {
      title: "Recommendations",
      href: "/recommendations",
      icon: ThumbsUp,
    },
    {
      title: "Publications",
      href: "/publications",
      icon: BookOpen,
    },
    {
      title: "Monetization",
      href: "/monetization",
      icon: Zap,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  const sidebarActions = (
    <div className="px-2 py-2">
      <PostTypeDropdown variant="outline" size="sm" className="w-full justify-start" buttonText="Create Post" />
    </div>
  )

  return (
    <div className="group flex h-screen w-16 flex-col justify-between border-r bg-background px-2 py-4 transition-all duration-300 hover:w-56 md:w-56">
      <div className="flex flex-col gap-4">
        <div className="flex h-16 items-center justify-center md:justify-start">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">H</span>
            </div>
            <span className="hidden text-xl font-bold group-hover:inline-block md:inline-block">Highlighter</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1">
          {routes.map((route, i) => (
            <Button
              key={i}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn("justify-start", pathname === route.href && "bg-secondary")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-5 w-5" />
                <span className="hidden group-hover:inline-block md:inline-block">{route.title}</span>
              </Link>
            </Button>
          ))}
        </nav>
        {sidebarActions}
      </div>
      <div className="flex flex-col gap-2 px-2">
        <div className="hidden flex-col gap-1 group-hover:flex md:flex">
          <p className="text-xs font-medium text-muted-foreground">highlighter.com/</p>
          <p className="truncate text-sm font-medium">yourpublication</p>
        </div>
        <Button variant="outline" size="sm" className="justify-start">
          <Zap className="mr-2 h-4 w-4" />
          <span className="hidden group-hover:inline-block md:inline-block">Upgrade Plan</span>
        </Button>
      </div>
    </div>
  )
}
