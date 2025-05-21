import { DraftButton } from '@/features/long-form-editor/components/DraftButton';
import { useEditorDraft } from '@/features/long-form-editor/hooks/useEditorDraft';
import { NDKKind, NDKUser } from '@nostr-dev-kit/ndk';
import { useNDK } from '@nostr-dev-kit/ndk-hooks';
import React, { useEffect, useState } from 'react';

/**
 * ProposalEditor component
 * - Showcases draft proposal creation and management.
 * - Includes debug statements for all key state changes and actions.
 */
export function ProposalEditor() {
    const { ndk } = useNDK();
    const draftId = 'proposal-123';
    const originalKind = NDKKind.Article;

    // Debug: log initial draftId and originalKind
    useEffect(() => {
        console.debug('[ProposalEditor] Initial draftId:', draftId, 'originalKind:', originalKind);
    }, []);

    const {
        content,
        setContent,
        saveDraft,
        isProposalMode,
        setIsProposalMode,
        proposalRecipient,
        setProposalRecipient,
    } = useEditorDraft({
        draftId,
        originalKind,
        autosave: true,
    });

    // Debug: log content, isProposalMode, proposalRecipient on change
    useEffect(() => {
        console.debug('[ProposalEditor] content:', content);
    }, [content]);
    useEffect(() => {
        console.debug('[ProposalEditor] isProposalMode:', isProposalMode);
    }, [isProposalMode]);
    useEffect(() => {
        console.debug('[ProposalEditor] proposalRecipient:', proposalRecipient);
    }, [proposalRecipient]);

    const [recipientNpub, setRecipientNpub] = useState('');

    // Debug: log recipientNpub changes
    useEffect(() => {
        console.debug('[ProposalEditor] recipientNpub:', recipientNpub);
    }, [recipientNpub]);

    // Handle recipient change
    const handleRecipientChange = () => {
        console.debug('[ProposalEditor] handleRecipientChange called with npub:', recipientNpub);
        if (!ndk || !recipientNpub) return;

        try {
            // Create NDKUser from npub
            const user = ndk.getUser({ npub: recipientNpub });

            console.debug('[ProposalEditor] Created NDKUser:', user);
            setProposalRecipient(user);
            setIsProposalMode(true);

            console.debug('[ProposalEditor] setProposalRecipient and setIsProposalMode(true) called');
        } catch (error) {
            console.error('[ProposalEditor] Invalid npub:', error);
        }
    };

    // Debug: log when saveDraft is called
    const handleSaveDraft = () => {
        console.debug('[ProposalEditor] saveDraft called');
        saveDraft();
    };

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Proposal Editor</h1>
                <DraftButton draftId={draftId} onSave={handleSaveDraft} />
            </div>
            <div className="mb-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-48 p-2 border rounded"
                    placeholder="Write your proposal here..."
                />
            </div>
            <div className="mb-4 flex items-center space-x-2">
                <label>
                    <input
                        type="checkbox"
                        checked={isProposalMode}
                        onChange={(e) => setIsProposalMode(e.target.checked)}
                        className="mr-2"
                    />
                    Send as proposal
                </label>
                <input
                    type="text"
                    value={recipientNpub}
                    onChange={(e) => setRecipientNpub(e.target.value)}
                    placeholder="Recipient npub"
                    className="border rounded p-1"
                />
                <button onClick={handleRecipientChange} className="px-3 py-1 bg-blue-500 text-white rounded">
                    Set Recipient
                </button>
                {proposalRecipient && (
                    <span className="ml-2 text-green-700">Recipient set: {proposalRecipient.npub}</span>
                )}
            </div>
        </div>
    );
}
