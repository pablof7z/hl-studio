import { ThreadEditor } from '@/components/posts/thread-editor/thread-editor';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'New Thread | Highlighter',
    description: 'Create a new thread on Highlighter',
};

export default function NewThreadPage() {
    return <ThreadEditor />;
}
