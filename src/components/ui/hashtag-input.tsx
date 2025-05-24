'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import React, { useState } from 'react';

interface HashtagInputProps {
    hashtags: string[];
    onHashtagsChange: (hashtags: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function HashtagInput({ 
    hashtags, 
    onHashtagsChange, 
    placeholder = "+ Add tag",
    className = ""
}: HashtagInputProps) {
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if (newTag.trim() && !hashtags.includes(newTag.trim())) {
            onHashtagsChange([...hashtags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onHashtagsChange(hashtags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className={`flex flex-wrap gap-1 pt-1 ${className}`}>
            {hashtags.map((tag) => (
                <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-1.5 py-0 gap-1"
                >
                    {tag}
                    <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 h-3 w-3 rounded-full flex items-center justify-center"
                    >
                        <X className="h-2 w-2" />
                    </button>
                </Badge>
            ))}
            <div className="inline-flex">
                <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder={placeholder}
                    className="border-0 p-0 h-auto w-fit text-xs shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                        }
                    }}
                />
            </div>
        </div>
    );
}