"use client";

import React from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { useNDK, useProfileValue, useSubscribe } from "@nostr-dev-kit/ndk-hooks";
import { DeleteButton } from "@/components/ui/atoms/DeleteButton";
import type { NodeViewProps } from "@tiptap/react";

/**
 * NAddrEditor renders an naddr entity as a styled inline component.
 * It uses useSubscribe to resolve and display the address entity.
 */

// Helper to parse naddr string (bech32 decode and split, simplified for common case)
function parseNaddr(naddr: string) {
    // naddr1... is bech32, but for simplicity, expect format: <kind>:<pubkey>:<identifier>
    // e.g. "30023:pubkey:identifier"
    // In production, use a proper bech32/nostr parser!
    const parts = naddr.split(":");
    if (parts.length === 3) {
        return {
            kind: Number(parts[0]),
            pubkey: parts[1],
            identifier: parts[2],
        };
    }
    return {};
}

export function NAddrEditor({ node, selected, deleteNode }: NodeViewProps) {
    useNDK();
    const naddr: string = node.attrs.naddr || node.attrs.value || "";
    const { kind, pubkey, identifier } = parseNaddr(naddr);

    const { events } = kind && pubkey && identifier
        ? useSubscribe(
            [{
                kinds: [kind],
                authors: [pubkey],
                "#d": [identifier],
                limit: 1,
            }],
            {},
            [kind, pubkey, identifier]
        )
        : { events: [] };
    const event = events && events.length > 0 ? events[0] : null;
    const authorProfile = event?.pubkey ? useProfileValue(event.pubkey) : undefined;

    return (
        <NodeViewWrapper
            as="span"
            className={`relative inline-flex items-center px-2 py-0.5 rounded text-green-800 text-xs font-mono cursor-pointer transition ${selected ? "bg-green-200" : "bg-green-100"}`}
            data-entity="naddr"
        >
            {selected && (
                <DeleteButton onClick={deleteNode} />
            )}
            {event
                ? <>
                    <span className="font-semibold">{authorProfile?.displayName || authorProfile?.name || event.pubkey?.slice(0, 8)}</span>
                    <span className="mx-1 text-green-400">•</span>
                    <span className="truncate max-w-[8em]">{identifier || naddr}</span>
                </>
                : naddr}
        </NodeViewWrapper>
    );
}