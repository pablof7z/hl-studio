'use client';

import { Button } from '@/components/ui/button';
import { CardStackIcon } from '@radix-ui/react-icons';
import { Bitcoin, User2 } from 'lucide-react';

export interface SettingsSidebarProps {
    activeSettingsTab: 'metadata' | 'monetization' | 'proposal';
    setActiveSettingsTab: (tab: 'metadata' | 'monetization' | 'proposal') => void;
}

export function SettingsSidebar({ activeSettingsTab, setActiveSettingsTab }: SettingsSidebarProps) {
    return (
        <div className="w-48 border-r h-full">
            <div className="py-4">
                <h2 className="px-4 text-lg font-semibold mb-4">Settings</h2>
                <div className="space-y-1">
                    <Button
                        variant={activeSettingsTab === 'metadata' ? 'secondary' : 'ghost'}
                        className="w-full justify-start px-4"
                        onClick={() => setActiveSettingsTab('metadata')}
                    >
                        <CardStackIcon />
                        Social Preview
                    </Button>
                    <Button
                        variant={activeSettingsTab === 'monetization' ? 'secondary' : 'ghost'}
                        className="w-full justify-start px-4"
                        onClick={() => setActiveSettingsTab('monetization')}
                    >
                        <Bitcoin />
                        Monetization
                    </Button>
                    <Button
                        variant={activeSettingsTab === 'proposal' ? 'secondary' : 'ghost'}
                        className="w-full justify-start px-4"
                        onClick={() => setActiveSettingsTab('proposal')}
                    >
                        <User2 />
                        Proposal
                    </Button>
                </div>
            </div>
        </div>
    );
}
