import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type React from 'react';
import { TimeSelector } from '../ui/TimeSelector';
import { getConfirmationButtonText } from './utils/getConfirmationButtonText';

export interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => void;
    publishAt?: Date | null;
    setPublishAt: (date: Date | null) => void;
    children?: React.ReactNode;
    buttonText?: string;
    isProposal?: boolean;
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    onSubmit,
    publishAt,
    setPublishAt,
    children,
    buttonText,
    isProposal = false,
}: ConfirmationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Publish</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    {children}
                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Publish Time</h3>

                        <div className="space-y-2">
                            <TimeSelector
                                value={publishAt}
                                onChange={setPublishAt}
                                defaultText="Publish now"
                                className="text-foreground"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={onSubmit}>
                        {buttonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
