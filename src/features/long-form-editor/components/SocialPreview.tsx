'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEditorStore } from '@/features/long-form-editor';
import UserAvatar from '@/features/nostr/components/user/UserAvatar';
import UserName from '@/features/nostr/components/user/UserName';
import { useNDKCurrentPubkey } from '@nostr-dev-kit/ndk-hooks';
import { Edit, ImageIcon, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';

export function SocialPreview() {
    const [isEditing, setIsEditing] = useState(false);
    const [newTag, setNewTag] = useState('');
    const currentPubkey = useNDKCurrentPubkey();
    // Use the editor store directly
    const { title, setTitle, summary, setSummary, tags, setTags } = useEditorStore();
    const hashtags = useMemo(() => (
        tags.filter((t: string[]) => t[0] === 't').map(t => t[1])
    ), [tags]);

    // For hero image, keep in editor store via a custom field
    const [image, setImage] = useEditorStore((s) => [s.image, s.setImage] as [string, (img: string) => void]);

    const handleAddTag = () => {
            setTags([...tags, ["t", newTag]]);
            setNewTag('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag[0] === 't' && tag[1] !== tagToRemove));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Social Preview</h3>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? (
                            'Done'
                        ) : (
                            <>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </>
                        )}
                    </Button>
                </div>

                <Card className="overflow-hidden border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <UserAvatar pubkey={currentPubkey ?? ''} size={'xs'} />
                                    <span className="text-sm font-medium">
                                        <UserName pubkey={currentPubkey ?? ''} />
                                    </span>
                                </div>

                                {isEditing ? (
                                    <>
                                        <Input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Article title"
                                            className="border-0 p-0 h-auto font-semibold text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                        <Textarea
                                            value={summary}
                                            onChange={(e) => setSummary(e.target.value)}
                                            placeholder="Brief summary of your article"
                                            className="border-0 p-0 h-auto min-h-0 text-sm text-muted-foreground resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                            rows={2}
                                        />
                                        <div className="flex flex-wrap gap-1 pt-1">
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
                                                    placeholder="+ Add tag"
                                                    className="border-0 p-0 h-auto w-20 text-xs shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleAddTag();
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="font-semibold text-base line-clamp-2">{title || 'Untitled'}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {summary || 'No summary'}
                                        </p>
                                        <div className="flex flex-wrap gap-1 pt-1">
                                            {hashtags.length === 0 && (
                                                <span className="text-xs text-muted-foreground italic">No tags</span>
                                            )}
                                            {hashtags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                {image ? (
                                    <>
                                        <img
                                            src={image || '/placeholder.svg'} // placeholder if src is empty
                                            alt="Hero image"
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                        />
                                        {isEditing && (
                                            <Label
                                                htmlFor="image-upload"
                                                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                            >
                                                <div className="text-white text-xs font-medium">Replace</div>
                                            </Label>
                                        )}
                                    </>
                                ) : (
                                    <Label
                                        htmlFor="image-upload"
                                        className={`flex h-full w-full items-center justify-center ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                                    >
                                        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                                    </Label>
                                )}
                                {isEditing && (
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
