"use client"

import { useState, useEffect, useCallback, forwardRef } from "react"
import { type User, mockUsers } from "@/data/mock-users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MentionListProps {
  items: User[]
  command: (user: User) => void
  query?: string
}

export const MentionList = forwardRef<HTMLDivElement, MentionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [filteredItems, setFilteredItems] = useState<User[]>(props.items)

  const selectItem = useCallback(
    (index: number) => {
      const item = filteredItems[index]
      if (item) {
        props.command(item)
      }
    },
    [filteredItems, props],
  )

  useEffect(() => {
    console.log("MentionList rendered with query:", props.query)

    if (props.query !== undefined) {
      const lowercaseQuery = props.query.toLowerCase()
      const filtered = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercaseQuery) || user.handle.toLowerCase().includes(lowercaseQuery),
      )
      console.log("Filtered users:", filtered.length)
      setFilteredItems(filtered)
      setSelectedIndex(0)
    } else {
      setFilteredItems(props.items)
    }
  }, [props.items, props.query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((selectedIndex + filteredItems.length - 1) % filteredItems.length)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((selectedIndex + 1) % filteredItems.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        selectItem(selectedIndex)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedIndex, filteredItems, selectItem])

  return (
    <div
      ref={ref}
      className="bg-white rounded-md shadow-md border border-border overflow-hidden max-h-[250px] overflow-y-auto w-[250px] z-50"
    >
      {filteredItems.length > 0 ? (
        <div>
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-muted ${
                index === selectedIndex ? "bg-muted" : ""
              }`}
              onClick={() => selectItem(index)}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.avatar || "/placeholder.svg"} alt={item.name} />
                <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">@{item.handle}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-3 text-sm text-muted-foreground">No users found</div>
      )}
    </div>
  )
})

MentionList.displayName = "MentionList"
