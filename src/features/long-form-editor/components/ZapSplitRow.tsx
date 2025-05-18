"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { NDKUser } from "@nostr-dev-kit/ndk"
import { useProfileValue } from "@nostr-dev-kit/ndk-hooks"
import UserAvatar from "@/features/nostr/components/user/UserAvatar"

type ZapSplitRowProps = {
    user: NDKUser;
    split: number;
    sharePercent: number;
    onRemove: () => void;
    onUpdate: (split: number) => void;
}

export function ZapSplitRow({ user, split, sharePercent, onRemove, onUpdate }: ZapSplitRowProps) {
    const [editMode, setEditMode] = useState(false)
    const [splitInput, setSplitInput] = useState(split.toString())
    const profile = useProfileValue(user.pubkey)

    const handleSave = () => {
        const newSplit = parseInt(splitInput, 10)
        if (!isNaN(newSplit) && newSplit > 0) {
            onUpdate(newSplit)
            setEditMode(false)
        }
    }

    return (
        <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center gap-2">
                <UserAvatar pubkey={user.pubkey} size="sm" />
                <div>
                    <p className="font-medium">{profile?.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{user.npub.slice(0, 10)}...</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                {editMode ? (
                    <>
                        <Input
                            className="w-16"
                            type="number"
                            min="1"
                            value={splitInput}
                            onChange={(e) => setSplitInput(e.target.value)}
                        />
                        <Button size="sm" variant="outline" onClick={handleSave}>
                            Save
                        </Button>
                    </>
                ) : (
                    <>
                        <span className="font-medium">
                            {split} <span className="text-xs text-muted-foreground">(share: {sharePercent}%)</span>
                        </span>
                        <Button size="sm" variant="ghost" onClick={() => setEditMode(true)}>
                            Edit
                        </Button>
                    </>
                )}
                <Button size="sm" variant="ghost" onClick={onRemove}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}