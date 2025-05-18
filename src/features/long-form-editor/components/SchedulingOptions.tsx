import { useEditorStore } from "@/domains/editor/stores/editorStore";

export function SchedulingOptions() {
    const { isScheduled, isEarlyAccess, setIsScheduled, setIsEarlyAccess } = useEditorStore();

    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Scheduling Options</h3>
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="schedule-toggle"
                        checked={isScheduled}
                        onChange={(e) => setIsScheduled(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="schedule-toggle" className="block text-sm font-medium">
                        Schedule for later
                    </label>
                </div>

                {isScheduled && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Publish Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                )}

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="early-access-toggle"
                        checked={isEarlyAccess}
                        onChange={(e) => setIsEarlyAccess(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="early-access-toggle" className="block text-sm font-medium">
                        Enable Early Access
                    </label>
                </div>

                {isEarlyAccess && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Early Access Duration
                        </label>
                        <select className="w-full border rounded px-3 py-2">
                            <option>24 hours</option>
                            <option>48 hours</option>
                            <option>1 week</option>
                            <option>Custom...</option>
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}