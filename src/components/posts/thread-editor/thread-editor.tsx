'use client';

import { ThreadPost } from '@/components/posts/thread-editor/thread-post';
import { ThreadSidebar } from '@/components/posts/thread-editor/thread-sidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export interface Post {
    id: string;
    content: string;
    images: string[];
}

export function ThreadEditor() {
    const [posts, setPosts] = useState<Post[]>([{ id: '1', content: '', images: [] }]);
    const [activePostId, setActivePostId] = useState<string>('1');

    const addPost = () => {
        const newPost: Post = {
            id: Date.now().toString(),
            content: '',
            images: [],
        };
        setPosts([...posts, newPost]);
        setActivePostId(newPost.id);
    };

    const updatePost = (id: string, content: string) => {
        setPosts(posts.map((post) => (post.id === id ? { ...post, content } : post)));
    };

    const addImageToPost = (id: string, imageUrl: string) => {
        setPosts(posts.map((post) => (post.id === id ? { ...post, images: [...post.images, imageUrl] } : post)));
    };

    const removePost = (id: string) => {
        if (posts.length > 1) {
            const newPosts = posts.filter((post) => post.id !== id);
            setPosts(newPosts);
            if (activePostId === id) {
                setActivePostId(newPosts[0].id);
            }
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <ThreadSidebar />

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
                        <Button variant="default" size="sm">
                            {'Continue'}
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
