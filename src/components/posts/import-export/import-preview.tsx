"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"

interface ImportPreviewProps {
  data: {
    title: string
    status: string
    publishDate?: string
    lastUpdated?: string
    wordCount: number
  }[]
  onImport: () => void
  onCancel: () => void
}

export function ImportPreview({ data, onImport, onCancel }: ImportPreviewProps) {
  const [selectedPosts, setSelectedPosts] = useState<number[]>(data.map((_, i) => i))

  const toggleSelectAll = () => {
    if (selectedPosts.length === data.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(data.map((_, i) => i))
    }
  }

  const toggleSelectPost = (index: number) => {
    if (selectedPosts.includes(index)) {
      setSelectedPosts(selectedPosts.filter((i) => i !== index))
    } else {
      setSelectedPosts([...selectedPosts, index])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview Import</CardTitle>
        <CardDescription>Review and select the content you want to import</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPosts.length === data.length && data.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all posts"
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Word Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((post, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPosts.includes(index)}
                      onCheckedChange={() => toggleSelectPost(index)}
                      aria-label={`Select ${post.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.status}</TableCell>
                  <TableCell>{post.publishDate || post.lastUpdated}</TableCell>
                  <TableCell>{post.wordCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          {selectedPosts.length} of {data.length} posts selected for import
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Back
        </Button>
        <Button onClick={onImport} disabled={selectedPosts.length === 0}>
          Import Selected ({selectedPosts.length})
        </Button>
      </CardFooter>
    </Card>
  )
}
