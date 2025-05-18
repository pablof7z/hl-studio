"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNDK, useNDKCurrentUser } from "@nostr-dev-kit/ndk-hooks"
import { useEditorStore } from "../../stores"
import { ZapSplitRow } from "../ZapSplitRow"
import { useZapSplitValidation } from "../../hooks/useZapSplitValidation"
import { MentionModal } from "@/features/mention/components/MentionModal"
import { MentionEntity } from "@/features/mention/types"
import { PlusCircle } from "lucide-react"

export function MonetizationSection() {
    const { ndk } = useNDK()
    const currentUser = useNDKCurrentUser()
    const { zapSplits, addZapSplit, removeZapSplit, updateZapSplit } = useEditorStore()
    const [splitInput, setSplitInput] = useState("1")
    const [error, setError] = useState<string | null>(null)
    const [mentionModalOpen, setMentionModalOpen] = useState(false);

    // Simple duplicate check, no percentage logic needed
    const isDuplicateUser = useCallback(
        (splits: { user: { pubkey: string } }[], pubkey: string) =>
            splits.some((s) => s.user.pubkey === pubkey),
        []
    );

    // Initialize with current user if no splits
    useEffect(() => {
        if (zapSplits.length === 0 && currentUser) {
            addZapSplit(currentUser, 1)
        }
    }, [zapSplits.length, currentUser, addZapSplit])

    // Handle user selection from MentionModal
    const handleUserSelect = useCallback((entity: MentionEntity) => {
        if (entity.type === "user" && entity.user) {
            setError(null);

            const split = parseInt(splitInput, 10);
            if (isNaN(split) || split < 1) {
                setError("Split must be a positive integer");
                return;
            }

            if (isDuplicateUser(zapSplits, entity.user.pubkey)) {
                setError("This user is already added");
                return;
            }

            addZapSplit(entity.user, split);
            setSplitInput("1");
        }
    }, [zapSplits, splitInput, isDuplicateUser, addZapSplit]);

    // Compute total split for percentage display
    const totalSplit = zapSplits.reduce((sum, s) => sum + s.split, 0);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Zap Splits</h3>
                <p className="text-sm text-muted-foreground">
                    Add contributors to share zap revenue with. Each split is an integer; the share is calculated as split/total.
                </p>
            </div>

            <div className="space-y-2">
                {zapSplits.map((split) => (
                    <ZapSplitRow
                        key={split.user.pubkey}
                        user={split.user}
                        split={split.split}
                        sharePercent={totalSplit > 0 ? Math.round((split.split / totalSplit) * 100) : 0}
                        onRemove={() => removeZapSplit(split.user.pubkey)}
                        onUpdate={(newSplit) => updateZapSplit(split.user.pubkey, newSplit)}
                    />
                ))}

                <Button
                    onClick={() => setMentionModalOpen(true)}
                    className="w-full mt-4"
                    variant="outline"
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add monetization split
                </Button>
            </div>

            <MentionModal
                open={mentionModalOpen}
                onSelect={handleUserSelect}
                onClose={() => setMentionModalOpen(false)}
            />
        </div>
    );
}