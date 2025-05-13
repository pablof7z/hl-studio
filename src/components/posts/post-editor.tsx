"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, ChevronDown, Clock, Eye, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function PostEditor() {
  const [content, setContent] = useState("")

  return (
    <div className="h-screen bg-background">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/posts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">New Long-form Post</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button variant="default" size="sm">
            Publish
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Post title"
            className="text-2xl font-bold border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex flex-wrap gap-2">
            <Select defaultValue="article">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Post Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="public">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="subscribers">Subscribers Only</SelectItem>
                <SelectItem value="paid">Paid Subscribers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="write" className="mt-6">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="min-h-[500px]">
            <Textarea
              placeholder="Start writing your post..."
              className="min-h-[500px] resize-none border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="preview" className="min-h-[500px] prose max-w-none">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }} />
            ) : (
              <p className="text-muted-foreground">Nothing to preview yet.</p>
            )}
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
            <CardDescription>Configure how and when your post will be published</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Featured Image</h3>
                <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                  <Button variant="outline">Upload Image</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Schedule</h3>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Publish immediately</span>
                  </div>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule for later
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    Publish
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Publish Now</DropdownMenuItem>
                  <DropdownMenuItem>Schedule</DropdownMenuItem>
                  <DropdownMenuItem>Publish & Send to Subscribers</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
