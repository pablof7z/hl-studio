import { useEditorStore } from "@/domains/editor/stores/editorStore";

export function SocialPreview() {
    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Social Preview</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder="Article title for social sharing"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Summary
                    </label>
                    <textarea
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                        placeholder="Brief summary for social sharing"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Article Image
                    </label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500 mb-2">
                            Drag and drop an image here or click to browse
                        </p>
                        <button
                            type="button"
                            className="text-sm text-blue-500 hover:text-blue-700"
                        >
                            Select Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}