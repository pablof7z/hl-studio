import { DraftId, useDraftStatus } from '@/domains/drafts';
import { Button } from '@/ui/atoms/Button';
import { Tooltip } from '@/ui/molecules/Tooltip';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';

interface DraftButtonProps {
    draftId: DraftId;
    onSave: () => void;
    className?: string;
}

export function DraftButton({ draftId, onSave, className }: DraftButtonProps) {
    // Debug: log draftId prop

    console.debug('[DraftButton] draftId:', draftId);

    const { status, lastSaved, error } = useDraftStatus(draftId);

    // Debug: log status, lastSaved, error from useDraftStatus

    console.debug('[DraftButton] useDraftStatus:', { status, lastSaved, error });

    // Determine status indicator color
    const statusColor = {
        unsaved: 'bg-yellow-500',
        saving: 'bg-blue-500 animate-pulse',
        saved: 'bg-green-500',
        error: 'bg-red-500',
    }[status];

    // Format last saved time
    const lastSavedText = lastSaved
        ? `Last saved ${formatDistanceToNow(lastSaved * 1000, { addSuffix: true })}`
        : 'Not saved yet';

    // Tooltip content
    const tooltipContent = error ? `Error: ${error.message}` : lastSavedText;

    const handleSave = () => {
        // Debug: log when onSave is called

        console.debug('[DraftButton] onSave called for draftId:', draftId);
        onSave();
    };

    return (
        <Tooltip content={tooltipContent}>
            <Button onClick={handleSave} className={className} variant="outline" disabled={status === 'saving'}>
                <span className={`w-2 h-2 rounded-full mr-2 ${statusColor}`} />
                {status === 'saving' ? 'Saving...' : 'Save Draft'}
            </Button>
        </Tooltip>
    );
}
