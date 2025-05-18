/*
 * nostr-editor.tsx
 * Implements NostrExtension with ReactNodeViewRenderer for nprofile, nevent, naddr entities.
 * Follows the exact pattern from nostr-editor/examples/react/src/App.tsx.
 */
"use client";

import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
// Import our longform styles
import "@/styles/longform.css";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorToolbar } from "./editor-toolbar";
import { useNDK, useNDKCurrentPubkey, useProfileValue } from "@nostr-dev-kit/ndk-hooks";
import { NDKEvent, NDKRawEvent, NDKUser, NostrEvent } from "@nostr-dev-kit/ndk";
import { NostrExtension } from "nostr-editor";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { NEventEditor } from "./NEventEditor";
import { ImageEditor } from "./ImageEditor";
import MentionExtension from "@tiptap/extension-mention";
import { MentionModal } from "@/features/mention/components/MentionModal";
import { MentionEntity } from "@/features/mention/types";
import { MentionEditor } from "./MentionEditor";
import { Markdown } from "tiptap-markdown";

// --- NodeView for naddr ---
function NAddrNodeView({ node }: any) {
    // node.attrs.naddr should be the naddr string
    const naddr = node.attrs.naddr || node.attrs.value || "";
    // For demo, just show naddr
    return (
        <NodeViewWrapper as="span" className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-mono cursor-pointer hover:bg-green-200 transition" data-entity="naddr">
            {naddr}
        </NodeViewWrapper>
    );
}

export interface NostrEditorProps {
    event?: NDKEvent | null;
    onChange: (content: string) => void;
    kind?: number; // nostr kind, default to NDKKind.Article
    onPublish?: (event: NDKEvent) => void;
    placeholder?: string;
}


export function NostrEditor({
    event,
    onChange,
    placeholder = "Start writing...",
}: NostrEditorProps) {
    const { ndk } = useNDK();
    const pubkey = useNDKCurrentPubkey();
    const [mentionModalOpen, setMentionModalOpen] = useState(false);
    const [selectedMentionEntity, setSelectedMentionEntity] = useState<MentionEntity | null>(null);
    const [isPending, setPending] = useState<boolean>(false)
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
                types: ["heading", "paragraph"],
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
                            onUpdate: () => {
                                // Nothing to do here, the modal handles its own updates
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
                        // Add class to help with styling isolation
                        HTMLAttributes: { class: 'nostr-entity nostr-profile' }
                    },
                    nevent: {
                        addNodeView: () => ReactNodeViewRenderer(NEventEditor),
                        // Add class to help with styling isolation
                        HTMLAttributes: { class: 'nostr-entity nostr-event' }
                    },
                    naddr: {
                        addNodeView: () => ReactNodeViewRenderer(NAddrNodeView),
                        // Add class to help with styling isolation
                        HTMLAttributes: { class: 'nostr-entity nostr-addr' }
                    },
                    image: {
                        addNodeView: () => ReactNodeViewRenderer(ImageEditor),
                        // Add class to help with styling isolation
                        HTMLAttributes: { class: 'nostr-entity nostr-image' }
                    },
                },
                image: {
                    defaultUploadUrl: 'https://nostr.download',
                    defaultUploadType: 'blossom',
                },
                fileUpload: {
                    immediateUpload: true,
                    sign: async (event) => {
                        if (!ndk) throw new Error("NDK not initialized");
                        const e = new NDKEvent(ndk, event);
                        await e.sign();
                        return e.rawEvent();
                    },
                    onDrop() {
                        setPending(true)
                    },
                    onComplete() {
                        console.log('Upload Completed')
                        setPending(false)
                    },
                }
            }),
        ],
        content: "<h1></h1><h2></h2><p></p>",
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: "longform-content longform-editor prose prose-lg max-w-none focus:outline-none",
            },
        },
    });

    useEffect(() => {
        if (!editor || !event) return;
        editor.commands.setEventContent(event.rawEvent() as NDKRawEvent)
    }, [event?.id]);

    // Handle mention selection
    useEffect(() => {
        if (!editor || !selectedMentionEntity) return;

        // Insert the appropriate entity based on type
        if (selectedMentionEntity.type === "user" && selectedMentionEntity.user) {
            const user = selectedMentionEntity.user;
            editor.chain().focus().insertNProfile({
                bech32: user.npub,
            }).run();
        } else if (selectedMentionEntity.type === "event" && selectedMentionEntity.event) {
            const event = selectedMentionEntity.event;
            if (selectedMentionEntity.identifier?.startsWith("nevent")) {
                editor.chain().focus().insertNEvent({
                    bech32: selectedMentionEntity.identifier || "",
                }).run();
            } else if (selectedMentionEntity.identifier?.startsWith("naddr")) {
                editor.chain().focus().insertNAddr({
                    bech32: selectedMentionEntity.identifier || "",
                }).run();
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
                <EditorContent editor={editor} className="min-h-[70vh]" />
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