'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmationDialog } from '@/components/posts/ConfirmationDialog';
import { ThreadPost } from './ThreadPost';
import { ThreadSidebar } from './ThreadSidebar';
import { useThreadPosts } from '../hooks/useThreadPosts';
import { useThreadDraftPersistence } from '../hooks/useThreadDraftPersistence';
import type { Post } from '../types';

export function ThreadEditor() {
    const {
        posts,
        activePostId,
        addPost,
        updatePost,
        addImageToPost,
        removePost,
        setActivePostId,
        setPosts,
    } = useThreadPosts();

    // Persistence hook
    const { restoreDraft, resetDraft, hasDraft } = useThreadDraftPersistence(
        posts,
        activePostId,
        setPosts,
        setActivePostId
    );

    // On mount, restore draft if present
    useEffect(() => {
        if (hasDraft) {
            restoreDraft();
        }
        // Only run on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const handlePublishOrSchedule = () => {
        // Intentionally left empty
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <ThreadSidebar />

            <ConfirmationDialog
                open={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}
                onPublish={handlePublishOrSchedule}
                onSchedule={handlePublishOrSchedule}
            >
                {/* <SocialPreview /> */}
            </ConfirmationDialog>

            <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between border-b p-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/posts">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Tabs defaultValue="edit" className="w-[200px]">
                            <TabsList>
                                <TabsTrigger value="edit">Edit</TabsTrigger>
                                <TabsTrigger value="preview">Preview</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="default" size="sm" onClick={() => setIsConfirmDialogOpen(true)}>
                            {'Continue'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={resetDraft}
                            style={{ marginLeft: 8 }}
                        >
                            Reset
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="mx-auto max-w-2xl">
                        {posts.map((post, index) => (
                            <ThreadPost
                                key={post.id}
                                post={post}
                                index={index}
                                isActive={post.id === activePostId}
                                onContentChange={(content) => updatePost(post.id, content)}
                                onAddImage={(imageUrl) => addImageToPost(post.id, imageUrl)}
                                onRemove={() => removePost(post.id)}
                                onFocus={() => setActivePostId(post.id)}
                                isFirst={index === 0}
                                isLast={index === posts.length - 1}
                            />
                        ))}

                        <div className="mt-4 flex justify-center">
                            <Button variant="outline" onClick={addPost}>
                                Add Post
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}