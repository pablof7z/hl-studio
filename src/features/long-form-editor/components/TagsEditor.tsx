import { Input } from '@/components/ui/input'; // Assuming Input component is used
import { Label } from '@/components/ui/label'; // Assuming Label component is used
import { useEditorStore } from '../stores';
import React from 'react';

interface TagsEditorProps {
    tags?: string[];
    onTagsChange: (tags: string[]) => void;
    // earlyAccessTags?: string[]; // Optional: if early access tags also need to be controlled
    // onEarlyAccessTagsChange?: (tags: string[]) => void; // Optional
}

export function TagsEditor({ tags = [], onTagsChange }: TagsEditorProps) {

    const handleTagsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTags = event.target.value
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag !== '');
        onTagsChange(newTags);
    };

    // Placeholder for early access tags if they become controlled
    // const handleEarlyAccessTagsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (onEarlyAccessTagsChange) {
    //         const newTags = event.target.value.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
    //         onEarlyAccessTagsChange(newTags);
    //     }
    // };

    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Tags</h3>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="tags-input" className="block text-sm font-medium mb-1">
                        Add tags to help readers find your content
                    </Label>
                    <Input
                        id="tags-input"
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder="Add tags separated by commas"
                        value={tags.join(', ')}
                        onChange={handleTagsInputChange}
                    />
                </div>
            </div>
        </div>
    );
}
