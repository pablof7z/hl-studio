'use client';

/**
 * NEventEditor renders an nevent entity as a styled inline component.
 * It uses useEvent to resolve and display the event.
 */
import { DeleteButton } from '@/components/ui/atoms/DeleteButton';
import { NostrEventCard } from '@/features/nostr/components/card';
import { useEvent, useNDK, useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import React from 'react';

export function NEventEditor({ node, selected, deleteNode }: NodeViewProps) {
    useNDK();
    const nevent: string = node.attrs.bech32 || node.attrs.value || '';
    const event = useEvent(nevent);

    return (
        <NodeViewWrapper
            as="span"
            className={`embed-event relative inline-flex items-center px-2 py-0.5 rounded transition ${selected ? 'bg-blue-100' : ''}`}
            data-entity="nevent"
        >
            {selected && <DeleteButton onClick={deleteNode} />}
            {event ? <NostrEventCard event={event} /> : <span className="text-gray-500">Loading...</span>}
        </NodeViewWrapper>
    );
}
