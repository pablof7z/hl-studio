import type { Metadata } from "next"
import { ThreadEditor } from "@/components/posts/thread-editor/thread-editor"

export const metadata: Metadata = {
  title: "New Thread | Highlighter",
  description: "Create a new thread on Highlighter",
}

export default function NewThreadPage() {
  return <ThreadEditor />
}
