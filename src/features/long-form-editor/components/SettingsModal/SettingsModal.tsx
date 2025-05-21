'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { MetadataSection } from './MetadataSection';
import { MonetizationSection } from './MonetizationSection';
import { SettingsSidebar } from './SettingsSidebar';

export function SettingsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'metadata' | 'monetization'>('metadata');

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
                    <div className="flex h-[500px]">
                        <SettingsSidebar activeSettingsTab={activeTab} setActiveSettingsTab={setActiveTab} />
                        <div className="flex-1 p-6 overflow-y-auto">
                            {activeTab === 'metadata' && <MetadataSection />}
                            {activeTab === 'monetization' && <MonetizationSection />}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
