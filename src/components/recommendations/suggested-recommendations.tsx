"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockSuggestedRecommendations } from "@/data/mock-recommendations"

interface SuggestedRecommendationsProps {
  onRecommend: () => void
}

export function SuggestedRecommendations({ onRecommend }: SuggestedRecommendationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested</CardTitle>
        <CardDescription>Publications you might want to recommend</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSuggestedRecommendations.map((suggestion) => (
            <div key={suggestion.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={suggestion.avatar || "/placeholder.svg"} alt={suggestion.name} />
                  <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-muted-foreground">By {suggestion.author}</div>
                </div>
              </div>
              <Button variant="secondary" onClick={onRecommend}>
                Recommend
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
