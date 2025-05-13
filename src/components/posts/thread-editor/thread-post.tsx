"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { ImageIcon, Trash2, MoreHorizontal, MessageCircle, Repeat, Heart, BarChart2 } from "lucide-react"
import type { Post } from "./thread-editor"
import { MentionList } from "@/components/editor/mention-list"
import { mockUsers, type User } from "@/data/mock-users"

interface ThreadPostProps {
  post: Post
  index: number
  isActive: boolean
  displayName: string
  username: string
  avatarUrl: string
  onContentChange: (content: string) => void
  onAddImage: (imageUrl: string) => void
  onRemove: () => void
  onFocus: () => void
  isFirst: boolean
  isLast: boolean
}

export function ThreadPost({
  post,
  index,
  isActive,
  displayName,
  username,
  avatarUrl,
  onContentChange,
  onAddImage,
  onRemove,
  onFocus,
  isFirst,
  isLast,
}: ThreadPostProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // isFocused state was unused
  const [mentionPopupVisible, setMentionPopupVisible] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const [cursorPosition, setCursorPosition] = useState(0)
  const mentionListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isActive])

  const handleImageUpload = () => {
    // In a real app, this would open a file picker
    // For now, we'll just add a placeholder image
    onAddImage(`/placeholder.svg?height=300&width=500&query=post image ${index + 1}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Log when @ is typed to help debug
    if (e.key === "@") {
      console.log("@ key pressed in Thread editor")
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    onContentChange(value)

    // Check for mention trigger
    const curPos = e.target.selectionStart
    setCursorPosition(curPos)

    const textBeforeCursor = value.substring(0, curPos)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

    if (mentionMatch) {
      console.log("Mention match found:", mentionMatch)
      const query = mentionMatch[1]
      setMentionQuery(query)

      // Calculate position for mention popup
      if (textareaRef.current) {
        // Get the textarea's position
        const { top, left } = textareaRef.current.getBoundingClientRect() // height was unused

        // Create a temporary div to measure text width
        const tempDiv = document.createElement("div")
        tempDiv.style.position = "absolute"
        tempDiv.style.visibility = "hidden"
        tempDiv.style.whiteSpace = "pre-wrap"
        tempDiv.style.wordWrap = "break-word"
        tempDiv.style.width = `${textareaRef.current.clientWidth}px`
        tempDiv.style.fontSize = window.getComputedStyle(textareaRef.current).fontSize
        tempDiv.style.fontFamily = window.getComputedStyle(textareaRef.current).fontFamily
        tempDiv.style.padding = window.getComputedStyle(textareaRef.current).padding
        tempDiv.style.lineHeight = window.getComputedStyle(textareaRef.current).lineHeight

        // Get text before the cursor
        tempDiv.textContent = textBeforeCursor
        document.body.appendChild(tempDiv)

        // Calculate the position of the cursor
        const textWidth = tempDiv.clientWidth
        const textHeight = tempDiv.clientHeight
        document.body.removeChild(tempDiv)

        // Calculate the line height and number of lines
        const lineHeight = Number.parseInt(window.getComputedStyle(textareaRef.current).lineHeight) || 20
        const lines = Math.floor(textHeight / lineHeight)

        // Calculate the position for the mention popup
        const popupTop = top + lines * lineHeight + window.scrollY
        const popupLeft = left + (textWidth % textareaRef.current.clientWidth) + window.scrollX

        setMentionPosition({
          top: popupTop,
          left: popupLeft,
        })
      }

      setMentionPopupVisible(true)
    } else {
      setMentionPopupVisible(false)
    }
  }

  const insertMention = (user: User) => {
    if (textareaRef.current) {
      const value = post.content
      const curPos = cursorPosition

      // Find the position of the @ that triggered the mention
      const textBeforeCursor = value.substring(0, curPos)
      const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

      if (mentionMatch) {
        const mentionStartPos = textBeforeCursor.lastIndexOf("@")

        // Replace the @query with @username
        const newContent = value.substring(0, mentionStartPos) + `@${user.handle} ` + value.substring(curPos)

        onContentChange(newContent)

        // Set cursor position after the inserted mention
        const newCursorPos = mentionStartPos + user.handle.length + 2 // +2 for @ and space
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = newCursorPos
            textareaRef.current.selectionEnd = newCursorPos
            textareaRef.current.focus()
          }
        }, 0)
      }
    }

    setMentionPopupVisible(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mentionListRef.current && !mentionListRef.current.contains(event.target as Node)) {
        setMentionPopupVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div
      className={`relative mb-4 rounded-lg p-4 transition-all ${
        isActive ? "border-2 border-primary bg-background" : "border border-border bg-background/50"
      }`}
      onClick={onFocus}
    >
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          {!isLast && <div className="my-1 h-full w-0.5 bg-border" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-semibold">{displayName}</span>
              <span className="text-sm text-muted-foreground">@{username}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleImageUpload}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Add Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRemove} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={post.content}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              // onFocus and onBlur were only setting the unused isFocused state
              placeholder={isFirst ? "What's your main point?" : "Continue your thread..."}
              className="min-h-[80px] resize-none border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            {mentionPopupVisible && (
              <div
                ref={mentionListRef}
                style={{
                  position: "fixed",
                  top: mentionPosition.top,
                  left: mentionPosition.left,
                  zIndex: 50,
                }}
              >
                <MentionList items={mockUsers} command={insertMention} query={mentionQuery} />
              </div>
            )}
          </div>

          {post.images.length > 0 && (
            <div className="mt-2 grid gap-2">
              {post.images.map((image, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden">
                  <Image src={image || "/placeholder.svg"} alt={`Post image ${i + 1}`} width={500} height={300} className="w-full h-auto object-cover rounded-lg" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-80 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      const newImages = [...post.images]
                      newImages.splice(i, 1)
                      onContentChange(post.content)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {isActive && (
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleImageUpload}>
                <ImageIcon className="h-4 w-4" />
              </Button>
              <div className="ml-auto flex items-center gap-1 text-xs">
                <span>{post.content.length}</span>
                <span>/</span>
                <span>280</span>
              </div>
            </div>
          )}

          {isFirst && (
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>0</span>
              </div>
              <div className="flex items-center gap-1">
                <Repeat className="h-3.5 w-3.5" />
                <span>0</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                <span>0</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart2 className="h-3.5 w-3.5" />
                <span>0</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {isActive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
          #{index + 1}
        </div>
      )}
    </div>
  )
}
