"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImportPosts } from "@/components/posts/import-export/import-posts"
import { ExportPosts } from "@/components/posts/import-export/export-posts"

export function ImportExportTabs() {
  return (
    <Tabs defaultValue="import" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="import">Import</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
      </TabsList>
      <TabsContent value="import">
        <ImportPosts />
      </TabsContent>
      <TabsContent value="export">
        <ExportPosts />
      </TabsContent>
    </Tabs>
  )
}
