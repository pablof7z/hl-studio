import { useState } from 'react';
import type { Post } from '../types';

export function useThreadPosts(
    initialPosts?: Post[],
    initialActivePostId?: string
) {
    const [posts, setPosts] = useState<Post[]>(
        initialPosts && initialPosts.length > 0
            ? initialPosts
            : [{ id: '1', content: '', images: [] }]
    );
    const [activePostId, setActivePostId] = useState<string>(
        initialActivePostId ||
            (initialPosts && initialPosts.length > 0
                ? initialPosts[0].id
                : '1')
    );

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

    const [publishAt, setPublishAt] = useState<Date | null>();

    return {
        posts,
        activePostId,
        addPost,
        updatePost,
        addImageToPost,
        removePost,
        setActivePostId,
        setPosts,
        publishAt,
        setPublishAt,
    };
}