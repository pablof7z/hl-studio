"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bold, Italic, List, ListOrdered, ImageIcon, Link, Sparkles } from "lucide-react"


export function ThreadToolbar() {
    return (
        <div className="hidden w-64 flex-col border-l p-4 md:flex">
            <h3 className="mb-4 font-medium">Formatting</h3>

      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Link className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-4" />

      <h3 className="mb-4 font-medium">AI Assistance</h3>

      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start">
          <Sparkles className="mr-2 h-4 w-4" />
          Improve Writing
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Sparkles className="mr-2 h-4 w-4" />
          Make Shorter
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Sparkles className="mr-2 h-4 w-4" />
          Make Longer
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Sparkles className="mr-2 h-4 w-4" />
          Fix Grammar
        </Button>
      </div>

      <Separator className="my-4" />

      <h3 className="mb-4 font-medium">Thread Settings</h3>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Character count</span>
          <span className="font-medium">0/280</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Post count</span>
          <span className="font-medium">1</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Reading time</span>
          <span className="font-medium">~1 min</span>
        </div>
      </div>
    </div>
  )
}
