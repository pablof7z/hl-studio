"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, Loader2, Search, X } from "lucide-react"
import { mockPublicationSearchResults } from "@/data/mock-recommendations"

interface AddRecommendationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddRecommendationDialog({ open, onOpenChange }: AddRecommendationDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPublication, setSelectedPublication] = useState<(typeof mockPublicationSearchResults)[0] | null>(null)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredResults = searchQuery
    ? mockPublicationSearchResults.filter(
        (pub) =>
          pub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pub.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const handleSubmit = async () => {
    if (!selectedPublication || !reason.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would make an API call to save the recommendation
    console.log("Adding recommendation:", {
      publicationId: selectedPublication.id,
      reason,
    })

    setIsSubmitting(false)
    setSelectedPublication(null)
    setReason("")
    onOpenChange(false)
  }

  const handleSelectPublication = (publication: (typeof mockPublicationSearchResults)[0]) => {
    setSelectedPublication(publication)
    setSearchQuery("")
  }

  const handleClearSelection = () => {
    setSelectedPublication(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add recommendation</DialogTitle>
          <DialogDescription>
            Recommend a publication to your subscribers. This will appear on your publication page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="publication" className="flex items-center justify-between">
              Publication to recommend
              <span className="text-sm font-normal text-muted-foreground">Required</span>
            </Label>
            {selectedPublication ? (
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={selectedPublication.avatar || "/placeholder.svg"}
                      alt={selectedPublication.name}
                    />
                    <AvatarFallback>{selectedPublication.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedPublication.name}</div>
                    <div className="text-sm text-muted-foreground">By {selectedPublication.author}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClearSelection}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="publication"
                  placeholder="Search for a person or publication..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && filteredResults.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-lg">
                    {filteredResults.map((result) => (
                      <button
                        key={result.id}
                        className="flex w-full items-center gap-3 px-3 py-2 hover:bg-muted"
                        onClick={() => handleSelectPublication(result)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={result.avatar || "/placeholder.svg"} alt={result.name} />
                          <AvatarFallback>{result.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <div className="font-medium">{result.name}</div>
                          <div className="text-sm text-muted-foreground">By {result.author}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for recommending</Label>
            <Textarea
              id="reason"
              placeholder="Tell your subscribers why they'll love this publication"
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedPublication || !reason.trim() || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Add recommendation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
