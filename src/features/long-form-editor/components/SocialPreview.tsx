'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HashtagInput } from '@/components/ui/hashtag-input';
import { TimeSelector } from '@/components/ui/TimeSelector';
import NDKBlossom from "@nostr-dev-kit/ndk-blossom";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEditorStore } from '@/features/long-form-editor';
import UserAvatar from '@/features/nostr/components/user/UserAvatar';
import UserName from '@/features/nostr/components/user/UserName';
import { useNDK, useNDKCurrentPubkey } from '@nostr-dev-kit/ndk-hooks';
import { Edit, ImageIcon, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';

export function SocialPreview({ edit }: { edit?: boolean }) {
    const [isEditing, setIsEditing] = useState(edit);
    const currentPubkey = useNDKCurrentPubkey();
    // Use the editor store directly
    const { title, setTitle, summary, setSummary, tags, setTags, setUploadingImage, author, proposalCounterparty, publishAt, setPublishAt } = useEditorStore();
    const hashtags = useMemo(() => (
        tags.filter((t: string[]) => t[0] === 't').map(t => t[1])
    ), [tags]);
    const { ndk } = useNDK();

    // For hero image, keep in editor store via a custom field
    const { image, setImage } = useEditorStore();

    const handleHashtagsChange = (newHashtags: string[]) => {
        const newTags = tags.filter(tag => tag[0] !== 't');
        newHashtags.forEach(hashtag => {
            newTags.push(['t', hashtag]);
        });
        setTags(newTags);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!ndk) return;

        const file = e.target.files?.[0];
        const blossom = new NDKBlossom(ndk as any);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            
            try {
                setUploadingImage(true);
                const imeta = await blossom.upload(file, { maxRetries: 3, server: 'https://nostr.download' });
                console.log('Image uploaded:', imeta);
                if (imeta?.url) setImage(imeta.url);
            } catch (error) {
                console.error('Error uploading image:', error);
                setImage(null);
            } finally {
                setUploadingImage(false);
            }
        }
    };

    const displayPubkey = author ? author.pubkey : currentPubkey;

    if (!displayPubkey) {
        return null; // Don't render if no pubkey available
    }

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Social Preview</h3>

                <Card className="overflow-hidden border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Article title"
                                    className="border-0 p-0 h-auto font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 !text-lg"
                                />

                                <Textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    placeholder="Brief summary of your article"
                                    className="border-0 p-0 h-auto min-h-0 text-sm text-muted-foreground resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                    rows={2}
                                />

                                <div className="flex items-center gap-2">
                                    <UserAvatar pubkey={displayPubkey} size={'xs'} />
                                    <span className="text-sm font-medium">
                                        <UserName pubkey={displayPubkey} />
                                    </span>
                                    <TimeSelector
                                        value={publishAt}
                                        onChange={setPublishAt}
                                        defaultText="Publish now"
                                        className="text-xs text-muted-foreground"
                                    />
                                </div>
                                
                                <HashtagInput
                                    hashtags={hashtags}
                                    onHashtagsChange={handleHashtagsChange}
                                    placeholder="+ Add tag"
                                />
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
                                        <Label
                                            htmlFor="image-upload"
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            <div className="text-white text-xs font-medium">Replace</div>
                                        </Label>
                                    </>
                                ) : (
                                    <Label
                                        htmlFor="image-upload"
                                        className={`flex h-full w-full items-center justify-center ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                                    >
                                        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                                    </Label>
                                )}
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
