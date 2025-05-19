import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MentionSearchResultsUsers } from "./MentionSearchResultsUsers";
import { MentionSearchResultsEvent } from "./MentionSearchResultsEvent";
import { useNDK, useEvent } from "@nostr-dev-kit/ndk-hooks";
import { NDKUser, NDKEvent } from "@nostr-dev-kit/ndk";
import { useNostrUserSearch } from "@/domains/users/hooks/useNostrUserSearch";
import { MentionEntity } from "../types";

interface MentionModalProps {
    open: boolean;
    onSelect?: (entity: MentionEntity) => void;
    onClose?: () => void;
}

export const MentionModal: React.FC<MentionModalProps> = ({ open, onSelect, onClose }) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // If the query is a nostr event id, fetch the event
    const isEventQuery =
        query.startsWith("note1") ||
        query.startsWith("nevent1") ||
        query.startsWith("naddr1");
    const isUserQuery =
        query.startsWith("npub1") ||
        query.startsWith("nprofile1");

    // User search (for all queries except event ids)
    const { users } = useNostrUserSearch(
        !isEventQuery && query.length > 1 ? query : ""
    );

    // Event fetch (for note1/nevent1/naddr1)
    const event = useEvent(isEventQuery ? query : "");

    // Focus input when modal opens
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        } else {
            setQuery("");
            setSelectedIndex(0);
        }
    }, [open]);

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!isEventQuery && users.length > 0) {
            if (e.key === "ArrowDown") {
                setSelectedIndex((prev) => (prev + 1) % users.length);
                e.preventDefault();
            } else if (e.key === "ArrowUp") {
                setSelectedIndex((prev) => (prev - 1 + users.length) % users.length);
                e.preventDefault();
            } else if (e.key === "Enter") {
                onSelect?.({ type: "user", user: users[selectedIndex] });
                handleClose();
            }
        } else if (isEventQuery && event && e.key === "Enter") {
            onSelect?.({ type: "event", event, identifier: query });
            handleClose();
        }
    };

    const handleSelectUser = (user: NDKUser, index: number) => {
        onSelect?.({ type: "user", user });
        handleClose();
    };

    const handleSelectEvent = (event: NDKEvent) => {
        onSelect?.({ type: "event", event, identifier: query });
        handleClose();
    };

    const handleClose = () => {
        onClose?.();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
            <DialogContent className="sm:max-w-lg !h-[500px] overflow-auto">
                <div className="flex flex-col space-y-4">
                    <Input
                        id="mention-search-input"
                        ref={inputRef}
                        placeholder={
                            "Search by name, npub1, or paste note1/nevent1/naddr1"
                        }
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full !text-xl p-0 border-none !ring-0"
                        autoComplete="off"
                        data-testid="mention-search-input"
                    />
                    <div className="flex-1 grow w-full">
                        {isEventQuery ? (
                            <MentionSearchResultsEvent
                                event={event}
                                onSelectEvent={handleSelectEvent}
                            />
                        ) : (
                            <MentionSearchResultsUsers
                                users={users}
                                selectedIndex={selectedIndex}
                                onSelectUser={handleSelectUser}
                            />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};