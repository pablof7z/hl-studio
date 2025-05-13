import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare } from "lucide-react"

export function PostTypeSelector() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Long-form Post
          </CardTitle>
          <CardDescription>Create a detailed article with rich formatting and media</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg border bg-muted/50 flex items-center justify-center">
            <Image
              src="/placeholder.svg?key=it9cn"
              alt="Long-form post example"
              width={500}
              height={300}
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm">Best for:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• In-depth articles and essays</li>
              <li>• Tutorials and guides</li>
              <li>• Newsletters</li>
              <li>• Detailed analysis</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/editor/post">Create Long-form Post</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Thread
          </CardTitle>
          <CardDescription>Create a series of connected short posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg border bg-muted/50 flex items-center justify-center">
            <Image
              src="/placeholder.svg?key=kmmwq"
              alt="Thread example"
              width={500}
              height={300}
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm">Best for:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Step-by-step explanations</li>
              <li>• Tips and advice</li>
              <li>• Breaking down complex topics</li>
              <li>• Storytelling</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/editor/thread">Create Thread</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
