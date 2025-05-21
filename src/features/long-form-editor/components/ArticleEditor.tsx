import { NDKKind } from '@nostr-dev-kit/ndk';
import React, { useEffect, useRef, useState } from 'react';
import { useEditorDraft } from '../hooks/useEditorDraft';
import { DraftButton } from './DraftButton';
import { DraftHistorySidebar } from './DraftHistorySidebar';

// ArticleEditor demonstrates basic draft usage with debug statements
export function ArticleEditor() {
    const draftId = 'article-123'; // Unique identifier for this draft
    const originalKind = NDKKind.Article; // This draft will become an article when published

    // Debug: Log initial draftId and originalKind
    useEffect(() => {
        console.debug('[ArticleEditor] draftId:', draftId, 'originalKind:', originalKind);
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

    // Debug: Log content whenever it changes
    useEffect(() => {
        console.debug('[ArticleEditor] content changed:', content);
    }, [content]);

    const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
    const originalContentRef = useRef(content);

    // Open history sidebar
    const openHistorySidebar = () => {
        // Store the current content before opening the sidebar
        originalContentRef.current = content;
        // Debug: Log openHistorySidebar and originalContentRef

        console.debug(
            '[ArticleEditor] openHistorySidebar called, originalContentRef.current:',
            originalContentRef.current
        );
        setIsHistorySidebarOpen(true);
    };

    // Handle content preview from history
    const handlePreview = (previewContent: string) => {
        // Debug: Log previewContent

        console.debug('[ArticleEditor] handlePreview called, previewContent:', previewContent);
        setContent(previewContent);
    };

    // Handle content restore from history
    const handleRestore = (restoredContent: string) => {
        // Debug: Log restoredContent and call to saveDraft

        console.debug('[ArticleEditor] handleRestore called, restoredContent:', restoredContent);
        setContent(restoredContent);
        // Debug: Log before calling saveDraft

        console.debug('[ArticleEditor] handleRestore calling saveDraft()');
        saveDraft();
    };

    // Handle closing the sidebar
    const handleCloseSidebar = () => {
        // Debug: Log restoration of originalContentRef.current

        console.debug(
            '[ArticleEditor] handleCloseSidebar called, restoring originalContentRef.current:',
            originalContentRef.current
        );
        setContent(originalContentRef.current);
        setIsHistorySidebarOpen(false);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Article Editor</h1>
                <div className="flex space-x-2">
                    <button onClick={openHistorySidebar} className="px-4 py-2 bg-gray-200 rounded">
                        History
                    </button>
                    <DraftButton draftId={draftId} onSave={saveDraft} />
                </div>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-64 p-2 border rounded"
                placeholder="Write your article here..."
            />

            <DraftHistorySidebar
                draftId={draftId}
                isOpen={isHistorySidebarOpen}
                onClose={handleCloseSidebar}
                onPreview={handlePreview}
                onRestore={handleRestore}
                currentContent={originalContentRef.current}
            />
        </div>
    );
}
