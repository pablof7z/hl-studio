'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HashtagInput } from '@/components/ui/hashtag-input';
import { Camera, Edit3, ImageIcon } from 'lucide-react';
import { usePublicationEditorStore } from '../stores';
import { useNDKCurrentPubkey } from '@nostr-dev-kit/ndk-hooks';
import { AuthorDisplay } from './AuthorDisplay';

const CATEGORIES = [
    'Technology',
    'Business',
    'Science',
    'Health',
    'Arts',
    'Education',
    'Entertainment',
    'Sports',
    'Politics',
    'Lifestyle',
    'Travel',
    'Food',
    'Fashion',
    'Finance',
    'Other'
];

interface PublicationPreviewProps {
    onImageUpload: (field: 'banner' | 'image', e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddAuthor: () => void;
}

export function PublicationPreview({ onImageUpload, onAddAuthor }: PublicationPreviewProps) {
    const [editingField, setEditingField] = useState<string | null>(null);
    const currentPubkey = useNDKCurrentPubkey();
    
    const { 
        title, about,image, banner, category, hashtags, authors,
        updateField, removeAuthor
    } = usePublicationEditorStore();

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Banner */}
            <Label htmlFor="banner-upload" className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500 cursor-pointer group block">
                {banner ? (
                    <img src={banner} alt="Banner" className="w-full h-full object-cover" />
                ) : null}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-sm">
                            Click to change banner
                        </span>
                    </div>
                </div>
            </Label>
            <Input
                id="banner-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onImageUpload('banner', e)}
            />

            <div className="p-6 space-y-4">
                {/* Avatar and Title */}
                <div className="flex items-start gap-4">
                    <Label htmlFor="avatar-upload" className="relative w-16 h-16 bg-gray-200 rounded-full cursor-pointer group flex-shrink-0 block">
                        {image ? (
                            <img src={image} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-500" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-full flex items-center justify-center">
                            <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Label>
                    <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onImageUpload('image', e)}
                    />

                    <div className="flex-1">
                        {editingField === 'title' ? (
                            <Input
                                value={title}
                                onChange={(e) => updateField('title', e.target.value)}
                                onBlur={() => setEditingField(null)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                                autoFocus
                                className="text-xl font-bold"
                            />
                        ) : (
                            <h3 
                                className="text-xl font-bold text-gray-900 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1 group"
                                onClick={() => setEditingField('title')}
                            >
                                {title}
                                <Edit3 className="w-4 h-4 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                        )}

                        {/* Category */}
                        <div className="mt-2">
                            <Select 
                                value={category} 
                                onValueChange={(value) => updateField('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* About */}
                <div>
                    {editingField === 'about' ? (
                        <Textarea
                            value={about}
                            onChange={(e) => updateField('about', e.target.value)}
                            onBlur={() => setEditingField(null)}
                            placeholder="Describe your publication..."
                            autoFocus
                            rows={3}
                        />
                    ) : (
                        <p 
                            className="text-gray-600 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1 group min-h-[2rem] flex items-center"
                            onClick={() => setEditingField('about')}
                        >
                            {about || 'Click to add description...'}
                            <Edit3 className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                    )}
                </div>

                {/* Hashtags */}
                <div className="space-y-2 flex-grow w-full">
                    <HashtagInput
                        hashtags={hashtags}
                        onHashtagsChange={(tags) => updateField('hashtags', tags)}
                        placeholder="+ Add hashtag"
                        className="flex-1"
                    />
                </div>

                {/* Authors */}
                <div>
                    <div className="flex flex-wrap gap-2">
                        {authors.map(pubkey => (
                            <AuthorDisplay 
                                key={pubkey} 
                                pubkey={pubkey} 
                                currentPubkey={currentPubkey}
                                onRemove={removeAuthor}
                            />
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onAddAuthor}
                            className="rounded-full"
                        >
                            +
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}