"use client"

import { Button } from "@/components/ui/button"

export interface SettingsSidebarProps {
    activeSettingsTab: 'metadata' | 'monetization'
    setActiveSettingsTab: (tab: 'metadata' | 'monetization') => void
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
                        Metadata
                    </Button>
                    <Button
                        variant={activeSettingsTab === 'monetization' ? 'secondary' : 'ghost'}
                        className="w-full justify-start px-4"
                        onClick={() => setActiveSettingsTab('monetization')}
                    >
                        Monetization
                    </Button>
                </div>
            </div>
        </div>
    )
}