import { useEditorStore } from '@/domains/editor/stores/editorStore';

export function AudienceSelection() {
    const { isEarlyAccess } = useEditorStore();

    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Audience</h3>
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="public-audience"
                            name="audience"
                            value="public"
                            defaultChecked
                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="public-audience" className="block text-sm font-medium">
                            Public (Everyone can view)
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="subscribers-audience"
                            name="audience"
                            value="subscribers"
                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="subscribers-audience" className="block text-sm font-medium">
                            Subscribers only
                        </label>
                    </div>

                    {isEarlyAccess && (
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id="early-access-audience"
                                name="audience"
                                value="early-access"
                                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="early-access-audience" className="block text-sm font-medium">
                                Early access subscribers
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
