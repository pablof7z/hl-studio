import { useCallback, useEffect, useState } from "react";
import { useNostrUserSearch } from "@/domains/users";
import { useNostrEventSearch } from "@/domains/events";
import { useMentionStore, MentionEntity } from "../stores/mentionStore";

export interface UseMentionModalProps {
    onSelect?: (entity: MentionEntity) => void;
    onClose?: () => void;
}

export function useMentionModal({ onSelect, onClose }: UseMentionModalProps = {}) {
    const { 
        isOpen, 
        query, 
        selectedIndex, 
        selectedEntity,
        open, 
        close, 
        setQuery, 
        setSelectedIndex, 
        setSelectedEntity,
        reset
    } = useMentionStore();
    
    // Local state for tracking what type of search we're doing
    const [searchType, setSearchType] = useState<"user" | "event">("user");
    
    // Get search results from domain hooks
    const { users, eose: userEose } = useNostrUserSearch(
        searchType === "user" ? query : ""
    );
    
    const eventSearchResult = useNostrEventSearch(
        searchType === "event" ? query : ""
    );
    
    // Determine if the query looks like an event identifier
    useEffect(() => {
        if (!query) return;
        
        const isEventIdentifier = 
            query.startsWith("nevent1") || 
            query.startsWith("note1") || 
            query.startsWith("naddr1");
            
        setSearchType(isEventIdentifier ? "event" : "user");
    }, [query]);
    
    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;
        
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                if (searchType === "user" && users.length > 0) {
                    setSelectedIndex((selectedIndex + 1) % users.length);
                }
                break;
                
            case "ArrowUp":
                e.preventDefault();
                if (searchType === "user" && users.length > 0) {
                    setSelectedIndex((selectedIndex - 1 + users.length) % users.length);
                }
                break;
                
            case "Enter":
                e.preventDefault();
                if (searchType === "user" && users.length > 0) {
                    const user = users[selectedIndex];
                    const entity: MentionEntity = {
                        type: "user",
                        user,
                        identifier: user.npub
                    };
                    setSelectedEntity(entity);
                    onSelect?.(entity);
                    close();
                    reset();
                } else if (searchType === "event" && eventSearchResult.event) {
                    const entity: MentionEntity = {
                        type: "event",
                        event: eventSearchResult.event,
                        identifier: eventSearchResult.identifier
                    };
                    setSelectedEntity(entity);
                    onSelect?.(entity);
                    close();
                    reset();
                }
                break;
                
            case "Escape":
                e.preventDefault();
                close();
                reset();
                onClose?.();
                break;
        }
    }, [isOpen, searchType, users, selectedIndex, eventSearchResult, setSelectedIndex, setSelectedEntity, onSelect, close, reset, onClose]);
    
    // Add and remove keyboard event listener
    useEffect(() => {
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);
    
    // Handle selecting a user
    const selectUser = useCallback((user: any, index: number) => {
        setSelectedIndex(index);
        const entity: MentionEntity = {
            type: "user",
            user,
            identifier: user.npub
        };
        setSelectedEntity(entity);
        onSelect?.(entity);
        close();
        reset();
    }, [setSelectedIndex, setSelectedEntity, onSelect, close, reset]);
    
    // Handle selecting an event
    const selectEvent = useCallback((event: any) => {
        const entity: MentionEntity = {
            type: "event",
            event,
            identifier: eventSearchResult.identifier
        };
        setSelectedEntity(entity);
        onSelect?.(entity);
        close();
        reset();
    }, [eventSearchResult, setSelectedEntity, onSelect, close, reset]);
    
    return {
        isOpen,
        query,
        selectedIndex,
        selectedEntity,
        searchType,
        users,
        userEose,
        eventSearchResult,
        open,
        close,
        setQuery,
        selectUser,
        selectEvent,
        handleKeyDown
    };
}