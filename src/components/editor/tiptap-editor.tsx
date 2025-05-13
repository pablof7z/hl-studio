"use client"

import type React from "react"
import { createRoot, Root } from "react-dom/client"

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Mention from "@tiptap/extension-mention"
import { EditorToolbar } from "./editor-toolbar"
import { MentionList } from "./mention-list"
import { type User, mockUsers } from "@/data/mock-users"

interface TipTapEditorProps {
    content: string
    onChange: (content: string) => void
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
    const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading" && node.attrs.level === 1) {
            return "Title"
          }
          if (node.type.name === "heading" && node.attrs.level === 2) {
            return "Add a subtitle..."
          }
          return "Start writing..."
        },
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        renderLabel({ node }) {
          return `@${node.attrs.label ?? node.attrs.id}`
        },
        suggestion: {
          char: "@",
          allowSpaces: false,
          items: ({ query }) => {
            if (!query) return mockUsers

            const lowercaseQuery = query.toLowerCase()
            return mockUsers
              .filter(
                (user) =>
                  user.name.toLowerCase().includes(lowercaseQuery) ||
                  user.handle.toLowerCase().includes(lowercaseQuery),
              )
              .slice(0, 5)
          },
          render: () => {
            let reactRenderer: Root | null = null
            let popup: HTMLElement | null = null

            return {
              onStart: (props) => {
                // Create a DOM element for the popup
                popup = document.createElement("div")
                popup.style.position = "absolute"
                popup.style.zIndex = "1000"
                document.body.appendChild(popup)

                // Create a function to handle selection
                const onSelectItem = (user: User) => {
                  props.command({ id: user.id, label: user.handle })
                }

                // Render the MentionList component
                reactRenderer = createRoot(popup)
                reactRenderer.render(<MentionList items={props.items as User[]} command={onSelectItem} query={props.query} />)
              },
              onUpdate: (props) => {
                // Update the component props
                if (!reactRenderer || !popup) return

                const onSelectItem = (user: User) => {
                  props.command({ id: user.id, label: user.handle })
                }

                reactRenderer.render(<MentionList items={props.items as User[]} command={onSelectItem} query={props.query} />)

                // Update the popup position
                const rect = props.clientRect ? props.clientRect() : null
                if (rect) {
                  popup.style.left = `${rect.left}px`
                  popup.style.top = `${rect.top + 24}px`
                }
              },
              onKeyDown: (props) => {
                if (props.event.key === "@") {
                  console.log("@ key pressed in Mention suggestion (via suggestion.onKeyDown)");
                }
                if (props.event.key === "Escape") {
                  props.event.preventDefault()
                  return true
                }

                // Let MentionList handle other keys like ArrowUp, ArrowDown, Enter
                // We return false so that the default tiptap behavior is not prevented
                // The MentionList component itself adds event listeners for these keys.
                return false;
              },
              onExit: () => {
                if (reactRenderer) {
                  reactRenderer.unmount()
                  reactRenderer = null
                }

                if (popup) {
                  document.body.removeChild(popup)
                  popup = null
                }
              },
            }
          },
        },
      }),
    ],
    content: content || `<h1></h1><h2></h2><p></p>`,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none",
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="w-full">
      <EditorToolbar editor={editor} />

      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          shouldShow={({ editor, from, to }) => {
            // Only show the bubble menu when text is selected
            return from !== to && !editor.isActive("code")
          }}
          className="bg-white rounded-md shadow-md p-1 flex items-center gap-1 border"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded ${editor.isActive("bold") ? "bg-muted" : ""}`}
          >
            <BoldIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded ${editor.isActive("italic") ? "bg-muted" : ""}`}
          >
            <ItalicIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1 rounded ${editor.isActive("underline") ? "bg-muted" : ""}`}
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1 rounded ${editor.isActive("code") ? "bg-muted" : ""}`}
          >
            <CodeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const url = window.prompt("URL", "https://")
              if (url) {
                editor.chain().focus().setLink({ href: url }).run()
              }
            }}
            className={`p-1 rounded ${editor.isActive("link") ? "bg-muted" : ""}`}
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </BubbleMenu>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        <EditorContent editor={editor} className="min-h-[70vh]" />

        <div className="flex items-center gap-2 mt-4">
          <div className="bg-muted/50 rounded-full px-3 py-1 text-sm flex items-center gap-1">
            <span>Pablo Fernandez</span>
            <button className="text-muted-foreground hover:text-foreground">
              <XIcon className="h-3 w-3" />
            </button>
          </div>
          <button className="bg-muted/50 rounded-full w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground">
            <PlusIcon className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Icons
function BoldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 12a4 4 0 0 0 0-8H6v8" />
      <path d="M15 20a4 4 0 0 0 0-8H6v8Z" />
    </svg>
  )
}

function ItalicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" x2="10" y1="4" y2="4" />
      <line x1="14" x2="5" y1="20" y2="20" />
      <line x1="15" x2="9" y1="4" y2="20" />
    </svg>
  )
}

function UnderlineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4v6a6 6 0 0 0 12 0V4" />
      <line x1="4" x2="20" y1="20" y2="20" />
    </svg>
  )
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
