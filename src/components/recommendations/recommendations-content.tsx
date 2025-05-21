'use client';

import { AddRecommendationDialog } from '@/components/recommendations/add-recommendation-dialog';
import { OutgoingRecommendations } from '@/components/recommendations/outgoing-recommendations';
import { SuggestedRecommendations } from '@/components/recommendations/suggested-recommendations';
import { useState } from 'react';

export function RecommendationsContent() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    return (
        <div className="space-y-8">
            <OutgoingRecommendations onAddRecommendation={() => setIsAddDialogOpen(true)} />
            <SuggestedRecommendations onRecommend={() => setIsAddDialogOpen(true)} />

            <AddRecommendationDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
        </div>
    );
}
