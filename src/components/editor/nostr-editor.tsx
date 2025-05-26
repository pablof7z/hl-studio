/*
 * nostr-editor.tsx
 * Implements NostrExtension with ReactNodeViewRenderer for nprofile, nevent, naddr entities.
 * Follows the exact pattern from nostr-editor/examples/react/src/App.tsx.
 */
'use client';

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useState } from 'react';
// Import our longform styles
import '@/styles/longform.css';
import { MentionModal } from '@/features/mention/components/MentionModal';
import { MentionEntity } from '@/features/mention/types';
import { NDKEvent, NDKRawEvent, NDKUser, NostrEvent } from '@nostr-dev-kit/ndk';
import { useNDK, useNDKCurrentPubkey, useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import MentionExtension from '@tiptap/extension-mention';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { NostrExtension } from 'nostr-editor';
import { Markdown } from 'tiptap-markdown';
import { EditorToolbar } from './editor-toolbar';
import { ImageEditor } from './ImageEditor';
import { MentionEditor } from './MentionEditor';
import { NAddrEditor } from './NAddrEditor';
import { NEventEditor } from './NEventEditor';

export interface NostrEditorProps {
    event?: NDKEvent | null;
    onChange: (content: string) => void;
    kind?: number; // nostr kind, default to NDKKind.Article
    onPublish?: (event: NDKEvent) => void;
    placeholder?: string;
    children?: React.ReactNode;
}

export function NostrEditor({ event, children, onChange, placeholder = 'Start writing...' }: NostrEditorProps) {
    const { ndk } = useNDK();
    const pubkey = useNDKCurrentPubkey();
    const [mentionModalOpen, setMentionModalOpen] = useState(false);
    const [selectedMentionEntity, setSelectedMentionEntity] = useState<MentionEntity | null>(null);
    const [isPending, setPending] = useState<boolean>(false);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder,
            }),
            Image,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            Markdown.configure({
                transformCopiedText: true,
                transformPastedText: true,
            }),
            MentionExtension.configure({
                HTMLAttributes: {
                    class: 'mention',
                },
                suggestion: {
                    char: '@',
                    render: () => {
                        return {
                            onStart: () => {
                                setMentionModalOpen(true);
                            },
                            onKeyDown: () => {
                                // Let the modal handle keyboard navigation
                                return false;
                            },
                            onExit: () => {
                                // Nothing to do here, the modal is closed by itself
                            },
                        };
                    },
                },
            }),
            NostrExtension.configure({
                extend: {
                    nprofile: {
                        addNodeView: () => ReactNodeViewRenderer(MentionEditor),
                        HTMLAttributes: { class: 'nostr-entity nostr-profile' },
                    },
                    nevent: {
                        addNodeView: () => ReactNodeViewRenderer(NEventEditor),
                        HTMLAttributes: { class: 'nostr-entity nostr-event' },
                    },
                    naddr: {
                        addNodeView: () => ReactNodeViewRenderer(NAddrEditor),
                        HTMLAttributes: { class: 'nostr-entity nostr-addr' },
                    },
                    image: {
                        addNodeView: () => ReactNodeViewRenderer(ImageEditor),
                        // Add class to help with styling isolation
                        HTMLAttributes: { class: 'nostr-entity nostr-image' },
                    },
                },
                image: {
                    defaultUploadUrl: 'https://nostr.download',
                    defaultUploadType: 'blossom',
                },
                fileUpload: {
                    immediateUpload: true,
                    sign: async (event) => {
                        if (!ndk) throw new Error('NDK not initialized');
                        const e = new NDKEvent(ndk, event);
                        await e.sign();
                        return e.rawEvent();
                    },
                    onDrop() {
                        setPending(true);
                    },
                    onComplete() {
                        console.log('Upload Completed');
                        setPending(false);
                    },
                },
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            const markdown = editor.storage.markdown.getMarkdown();
            onChange(markdown);
        },
        editorProps: {
            attributes: {
                class: 'longform-content longform-editor prose prose-lg max-w-none focus:outline-none',
            },
        },
    });

    useEffect(() => {
        if (!editor || !event) return;
        editor.commands.setEventContent(event.rawEvent() as NDKRawEvent);
    }, [event?.id]);

    // Handle mention selection
    useEffect(() => {
        if (!editor || !selectedMentionEntity) return;

        // Insert the appropriate entity based on type
        if (selectedMentionEntity.type === 'user' && selectedMentionEntity.user) {
            const user = selectedMentionEntity.user;
            editor
                .chain()
                .focus()
                .deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from })
                .insertNProfile({
                    bech32: user.npub,
                })
                .run();
        } else if (selectedMentionEntity.type === 'event' && selectedMentionEntity.event) {
            const event = selectedMentionEntity.event;
            if (selectedMentionEntity.identifier?.startsWith('nevent')) {
                editor
                    .chain()
                    .focus()
                    .deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from })
                    .insertNEvent({
                        bech32: selectedMentionEntity.identifier || '',
                    })
                    .run();
            } else if (selectedMentionEntity.identifier?.startsWith('naddr')) {
                editor
                    .chain()
                    .focus()
                    .deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from })
                    .insertNAddr({
                        bech32: selectedMentionEntity.identifier || '',
                    })
                    .run();
            }
        }

        // Reset the selected entity
        setSelectedMentionEntity(null);
        setMentionModalOpen(false); // Close modal after selection
    }, [editor, selectedMentionEntity]);

    if (!editor) return null;

    return (
        <div className="w-full flex-col items-center justify-center">
            <EditorToolbar editor={editor} className="max-w-3xl mx-auto" />
            <div className="max-w-3xl mx-auto px-4 py-8">
                {children}
                <EditorContent editor={editor} className="min-h-[70vh] flex w-full" />
            </div>

            {/* Render the mention modal */}
            <MentionModal
                open={mentionModalOpen}
                onSelect={(entity: MentionEntity) => {
                    setSelectedMentionEntity(entity);
                    // The useEffect hook will handle insertion and closing the modal
                }}
                onClose={() => {
                    setMentionModalOpen(false);
                    if (editor) {
                        editor.commands.focus();
                    }
                }}
            />
        </div>
    );
}
