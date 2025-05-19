"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Settings } from "lucide-react"
import { useEditorStore } from "../../stores"
import { SettingsSidebar } from "./SettingsSidebar"
import { MetadataSection } from "./MetadataSection"
import { MonetizationSection } from "./MonetizationSection"

export function SettingsModal() {
    const { isSettingsModalOpen, closeSettingsModal, activeSettingsTab } = useEditorStore()

    return (
        <>
            <Button variant="ghost" size="sm" onClick={() => useEditorStore.getState().openSettingsModal()}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
            </Button>

            <Dialog open={isSettingsModalOpen} onOpenChange={(open) => {
                if (!open) closeSettingsModal()
            }}>
                <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
                    <div className="flex h-[500px]">
                        <SettingsSidebar />
                        <div className="flex-1 p-6 overflow-y-auto">
                            {activeSettingsTab === 'metadata' && <MetadataSection />}
                            {activeSettingsTab === 'monetization' && <MonetizationSection />}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}