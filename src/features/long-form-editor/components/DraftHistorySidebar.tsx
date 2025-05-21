import { DraftId, useDraftHistory } from '@/domains/drafts';
import { Button } from '@/ui/atoms/Button';
import { format } from 'date-fns';
import React, { useState } from 'react';

interface DraftHistorySidebarProps {
    draftId: DraftId;
    isOpen: boolean;
    onClose: () => void;
    onPreview: (content: string) => void;
    onRestore: (content: string) => void;
    currentContent: string;
}

export function DraftHistorySidebar({
    draftId,
    isOpen,
    onClose,
    onPreview,
    onRestore,
    currentContent,
}: DraftHistorySidebarProps) {
    // Debug: log props

    console.debug('[DraftHistorySidebar] props:', { draftId, isOpen, currentContent });

    const { history } = useDraftHistory(draftId);

    // Debug: log history array

    console.debug('[DraftHistorySidebar] useDraftHistory:', history);

    const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    // Debug: log selectedVersion and isPreviewMode state changes
    React.useEffect(() => {
        console.debug('[DraftHistorySidebar] selectedVersion changed:', selectedVersion);
    }, [selectedVersion]);
    React.useEffect(() => {
        console.debug('[DraftHistorySidebar] isPreviewMode changed:', isPreviewMode);
    }, [isPreviewMode]);

    // Handle preview click
    const handlePreview = (index: number) => {
        setSelectedVersion(index);
        const selectedItem = history[index];
        // Debug: log onPreview callback

        console.debug('[DraftHistorySidebar] onPreview called with content:', selectedItem?.event?.content);
        onPreview(selectedItem.event.content);
        setIsPreviewMode(true);
    };

    // Handle restore click
    const handleRestore = () => {
        if (selectedVersion === null) return;
        const selectedItem = history[selectedVersion];
        // Debug: log onRestore callback

        console.debug('[DraftHistorySidebar] onRestore called with content:', selectedItem?.event?.content);
        onRestore(selectedItem.event.content);
        // Debug: log onClose callback

        console.debug('[DraftHistorySidebar] onClose called after restore');
        onClose();
    };

    // Handle exit preview
    const handleExitPreview = () => {
        // Debug: log onPreview callback for exit

        console.debug('[DraftHistorySidebar] onPreview called for exit preview, content:', currentContent);
        onPreview(currentContent);
        setIsPreviewMode(false);
        setSelectedVersion(null);
    };

    if (!isOpen) return null;

    return (
        <aside className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Draft History</h2>
                <Button variant="ghost" onClick={onClose}>
                    Close
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <ul>
                    {history.map((item, idx) => (
                        <li key={item.event.id} className="mb-2">
                            <Button
                                variant={selectedVersion === idx ? 'solid' : 'outline'}
                                className="w-full justify-start"
                                onClick={() => handlePreview(idx)}
                            >
                                {format(item.event.created_at * 1000, 'yyyy-MM-dd HH:mm:ss')}
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-4 border-t flex gap-2">
                {isPreviewMode ? (
                    <>
                        <Button variant="outline" onClick={handleExitPreview}>
                            Exit Preview
                        </Button>
                        <Button variant="solid" onClick={handleRestore} disabled={selectedVersion === null}>
                            Restore This Version
                        </Button>
                    </>
                ) : (
                    <span className="text-sm text-gray-500">Select a version to preview or restore.</span>
                )}
            </div>
        </aside>
    );
}
