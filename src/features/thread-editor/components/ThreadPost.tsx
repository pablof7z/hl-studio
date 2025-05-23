'use client';

import { MentionList } from '@/components/editor/mention-list';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { mockUsers, type User } from '@/data/mock-users';
import UserAvatar from '@/features/nostr/components/user/UserAvatar';
import UserName from '@/features/nostr/components/user/UserName';
import { useNDK, useNDKCurrentPubkey, useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import { BarChart2, Heart, ImageIcon, MessageCircle, MoreHorizontal, Repeat, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Post } from '../types';
import NDKBlossom from '@nostr-dev-kit/ndk-blossom';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
/* Toast import removed: not available in this project */

interface ThreadPostProps {
    post: Post;
    index: number;
    isActive: boolean;
    onContentChange: (content: string) => void;
    onAddImage: (imageUrl: string) => void;
    onRemove: () => void;
    onFocus: () => void;
    isFirst: boolean;
    isLast: boolean;
}

export function ThreadPost({
    post,
    index,
    isActive,
    onContentChange,
    onAddImage,
    onRemove,
    onFocus,
    isFirst,
    isLast,
}: ThreadPostProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [mentionPopupVisible, setMentionPopupVisible] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
    const [cursorPosition, setCursorPosition] = useState(0);
    const mentionListRef = useRef<HTMLDivElement>(null);
    const currentPubkey = useNDKCurrentPubkey();
    const profile = useProfileValue(currentPubkey);

    // Local state for image upload
    const [uploadingImageIdx, setUploadingImageIdx] = useState<number | null>(null);
    const [localPreviews, setLocalPreviews] = useState<{ [idx: number]: string }>({});
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Toast not available; fallback to only visible error message

    useEffect(() => {
        if (isActive && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isActive]);

    const { ndk } = useNDK();

    // Trigger file input dialog
    const handleImageUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    // Handle file selection and upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadError(null);
        debugger
        if (!ndk) return;
        const file = e.target.files?.[0];
        console.log('File selected:', file);
        if (!file) return;
        
        const blossom = new NDKBlossom(ndk)
        
        // Local preview
        const reader = new FileReader();
        reader.onload = (ev) => {
            setLocalPreviews((prev) => ({
                ...prev,
                [post.images.length]: ev.target?.result as string,
            }));
        };
        reader.readAsDataURL(file);

        setUploadingImageIdx(post.images.length);

        try {
            const imeta = await blossom.upload(file, {
                maxRetries: 3,
                fallbackServer: 'https://nostr.download',
            });
            setUploadingImageIdx(null);
            setLocalPreviews((prev) => {
                const copy = { ...prev };
                delete copy[post.images.length];
                return copy;
            });
            if (imeta && typeof imeta.url === 'string' && imeta.url.length > 0) {
                onAddImage(imeta.url);
            } else {
                setUploadError('Image uploaded, but URL was not found.');
            }
        } catch (err: any) {
            setUploadingImageIdx(null);
            setUploadError('Image upload failed: ' + (err?.message || 'Unknown error'));
            setLocalPreviews((prev) => {
                const copy = { ...prev };
                delete copy[post.images.length];
                return copy;
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Log when @ is typed to help debug
        if (e.key === '@') {
            console.log('@ key pressed in Thread editor');
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        onContentChange(value);

        // Check for mention trigger
        const curPos = e.target.selectionStart;
        setCursorPosition(curPos);

        const textBeforeCursor = value.substring(0, curPos);
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

        if (mentionMatch) {
            console.log('Mention match found:', mentionMatch);
            const query = mentionMatch[1];
            setMentionQuery(query);

            // Calculate position for mention popup
            if (textareaRef.current) {
                // Get the textarea's position
                const { top, left } = textareaRef.current.getBoundingClientRect(); // height was unused

                // Create a temporary div to measure text width
                const tempDiv = document.createElement('div');
                tempDiv.style.position = 'absolute';
                tempDiv.style.visibility = 'hidden';
                tempDiv.style.whiteSpace = 'pre-wrap';
                tempDiv.style.wordWrap = 'break-word';
                tempDiv.style.width = `${textareaRef.current.clientWidth}px`;
                tempDiv.style.fontSize = window.getComputedStyle(textareaRef.current).fontSize;
                tempDiv.style.fontFamily = window.getComputedStyle(textareaRef.current).fontFamily;
                tempDiv.style.padding = window.getComputedStyle(textareaRef.current).padding;
                tempDiv.style.lineHeight = window.getComputedStyle(textareaRef.current).lineHeight;

                // Get text before the cursor
                tempDiv.textContent = textBeforeCursor;
                document.body.appendChild(tempDiv);

                // Calculate the position of the cursor
                const textWidth = tempDiv.clientWidth;
                const textHeight = tempDiv.clientHeight;
                document.body.removeChild(tempDiv);

                // Calculate the line height and number of lines
                const lineHeight = Number.parseInt(window.getComputedStyle(textareaRef.current).lineHeight) || 20;
                const lines = Math.floor(textHeight / lineHeight);

                // Calculate the position for the mention popup
                const popupTop = top + lines * lineHeight + window.scrollY;
                const popupLeft = left + (textWidth % textareaRef.current.clientWidth) + window.scrollX;

                setMentionPosition({
                    top: popupTop,
                    left: popupLeft,
                });
            }

            setMentionPopupVisible(true);
        } else {
            setMentionPopupVisible(false);
        }
    };

    const insertMention = (user: User) => {
        if (textareaRef.current) {
            const value = post.content;
            const curPos = cursorPosition;

            // Find the position of the @ that triggered the mention
            const textBeforeCursor = value.substring(0, curPos);
            const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

            if (mentionMatch) {
                const mentionStartPos = textBeforeCursor.lastIndexOf('@');

                // Replace the @query with @username
                const newContent = value.substring(0, mentionStartPos) + `@${user.handle} ` + value.substring(curPos);

                onContentChange(newContent);

                // Set cursor position after the inserted mention
                const newCursorPos = mentionStartPos + user.handle.length + 2; // +2 for @ and space
                setTimeout(() => {
                    if (textareaRef.current) {
                        textareaRef.current.selectionStart = newCursorPos;
                        textareaRef.current.selectionEnd = newCursorPos;
                        textareaRef.current.focus();
                    }
                }, 0);
            }
        }

        setMentionPopupVisible(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mentionListRef.current && !mentionListRef.current.contains(event.target as Node)) {
                setMentionPopupVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            className={`relative mb-4 rounded-lg p-4 transition-all ${isActive ? 'bg-background' : 'bg-background/50'}`}
            onClick={onFocus}
        >
            <div className="flex gap-3">
                <div className="flex flex-col items-center">
                    <UserAvatar pubkey={currentPubkey ?? ''} size="sm" />
                    {!isLast && <div className="my-1 h-full w-0.5 bg-border" />}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">
                                <UserName pubkey={currentPubkey ?? ''} />
                            </span>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">More options</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleImageUpload}>
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Add Image
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onRemove} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Post
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="relative">
                        <Textarea
                            ref={textareaRef}
                            value={post.content}
                            onChange={handleTextareaChange}
                            onKeyDown={handleKeyDown}
                            // onFocus and onBlur were only setting the unused isFocused state
                            placeholder={isFirst ? "What's your main point?" : 'Continue your thread...'}
                            className={cn(
                                "min-h-[80px] resize-none !border-none p-0 !ring-0",
                            )}
                        />

                        {mentionPopupVisible && (
                            <div
                                ref={mentionListRef}
                                style={{
                                    position: 'fixed',
                                    top: mentionPosition.top,
                                    left: mentionPosition.left,
                                    zIndex: 50,
                                }}
                            >
                                <MentionList items={mockUsers} command={insertMention} query={mentionQuery} />
                            </div>
                        )}
                    </div>

                    {(post.images.length > 0 || Object.keys(localPreviews).length > 0) && (
                        <div className="mt-2 grid gap-2">
                            {post.images.map((image, i) => (
                                <div key={i} className="relative rounded-lg overflow-hidden">
                                    <img
                                        src={image || '/placeholder.svg'}
                                        width={isActive ? 500 : 125}
                                        height={isActive ? 300 : 75}
                                        className={cn(
                                            "object-cover rounded-lg",
                                        )}
                                    />
                                    {/* Show uploading spinner if this image is uploading */}
                                    {uploadingImageIdx === i && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                                            <Loader2 className="animate-spin h-8 w-8 text-white" />
                                        </div>
                                    )}
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6 opacity-80 hover:opacity-100"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Remove image logic should be handled by parent, but for now just remove from UI
                                            // (Ideally, add an onRemoveImage prop)
                                            // Remove from images array
                                            // This is a placeholder: parent should update images
                                            // onRemoveImage(i)
                                        }}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                            {/* Local preview for uploading image */}
                            {Object.entries(localPreviews).map(([idx, url]) => (
                                <div key={`preview-${idx}`} className="relative rounded-lg overflow-hidden">
                                    <img
                                        src={url}
                                        alt="Uploading preview"
                                        className="w-full h-auto object-cover rounded-lg opacity-70"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                                        <Loader2 className="animate-spin h-8 w-8 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleImageUpload}>
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                        {uploadError && (
                            <span className="text-sm font-semibold text-destructive ml-2 bg-destructive/10 px-2 py-1 rounded">
                                {uploadError}
                            </span>
                        )}
                        <div className="ml-auto flex items-center gap-1 text-xs">
                            <span>{post.content.length}</span>
                            <span>/</span>
                            <span>280</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}