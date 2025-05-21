'use client';

import { NDKUser, useNDK, useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import { NodeViewWrapper } from '@tiptap/react';
import React, { useState } from 'react';

/**
 * MentionEditor renders an nprofile entity as a styled inline component.
 * It uses useNDK() and useProfileValue to resolve and display the user's profile.
 */
export function MentionEditor({ node }: { node: any }) {
    const user = new NDKUser({ pubkey: node.attrs.pubkey });
    const profile = useProfileValue(user.pubkey);

    return (
        <NodeViewWrapper
            as="span"
            className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-800 cursor-pointer hover:bg-purple-200 transition"
            data-entity="nprofile"
        >
            {profile?.displayName || profile?.name || user.npub}
        </NodeViewWrapper>
    );
}
