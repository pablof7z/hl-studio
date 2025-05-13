"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Download, FileJson, FileText, CheckCircle } from "lucide-react"
import { ExportPostsTable } from "@/components/posts/import-export/export-posts-table"

export function ExportPosts() {
  const [exportFormat, setExportFormat] = useState<string>("json")
  const [exportStage, setExportStage] = useState<"select" | "exporting" | "complete">("select")
  const [progress, setProgress] = useState<number>(0)
  const [exportOptions, setExportOptions] = useState({
    includeImages: true,
    includeComments: true,
    includeAnalytics: false,
  })
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])

  const handleExportClick = () => {
    if (exportStage === "select") {
      setExportStage("exporting")
      // Simulate export progress
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += 10
        setProgress(currentProgress)
        if (currentProgress >= 100) {
          clearInterval(interval)
          setExportStage("complete")
        }
      }, 300)
    }
  }

  const resetExport = () => {
    setExportStage("select")
    setProgress(0)
  }

  const handlePostSelection = (postIds: string[]) => {
    setSelectedPosts(postIds)
  }

  return (
    <div className="space-y-6">
      {exportStage === "select" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Configure how you want to export your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="json" id="json" />
                    <Label htmlFor="json" className="flex items-center gap-2">
                      <FileJson className="h-4 w-4" />
                      JSON (recommended)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="csv" id="csv" />
                    <Label htmlFor="csv" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CSV
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="markdown" id="markdown" />
                    <Label htmlFor="markdown" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Markdown
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Export Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeImages"
                      checked={exportOptions.includeImages}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeImages: checked === true })
                      }
                    />
                    <Label htmlFor="includeImages">Include images and attachments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeComments"
                      checked={exportOptions.includeComments}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeComments: checked === true })
                      }
                    />
                    <Label htmlFor="includeComments">Include comments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeAnalytics"
                      checked={exportOptions.includeAnalytics}
                      onCheckedChange={(checked) =>
                        setExportOptions({ ...exportOptions, includeAnalytics: checked === true })
                      }
                    />
                    <Label htmlFor="includeAnalytics">Include analytics data</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Posts to Export</CardTitle>
              <CardDescription>Choose which posts you want to include in your export</CardDescription>
            </CardHeader>
            <CardContent>
              <ExportPostsTable onSelectionChange={handlePostSelection} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">{selectedPosts.length} posts selected</div>
              <Button onClick={handleExportClick} disabled={selectedPosts.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
            </CardFooter>
          </Card>
        </>
      )}

      {exportStage === "exporting" && (
        <Card>
          <CardHeader>
            <CardTitle>Exporting Content</CardTitle>
            <CardDescription>Please wait while we prepare your export</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-center text-sm text-muted-foreground">
              Exporting {selectedPosts.length} posts ({progress}% complete)
            </p>
          </CardContent>
        </Card>
      )}

      {exportStage === "complete" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Export Complete
            </CardTitle>
            <CardDescription>Your content has been successfully exported</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <div className="text-sm font-medium">Export Summary</div>
              <ul className="mt-2 text-sm">
                <li>Total posts exported: {selectedPosts.length}</li>
                <li>Format: {exportFormat.toUpperCase()}</li>
                <li>File size: 2.4 MB</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetExport}>
              Create Another Export
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download Export
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
