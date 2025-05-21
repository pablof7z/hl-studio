import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PostsFilter } from '@/components/posts/posts-filter';
import { PostsTable } from '@/components/posts/posts-table';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Posts | Highlighter',
    description: 'Manage your content on Highlighter',
};

export default function PostsPage() {
    return (
        <DashboardShell>
            <DashboardHeader heading="Posts" text="Manage your content on Highlighter">
                <Button variant="outline" asChild>
                    <Link href="/posts/import-export">
                        <Upload className="mr-2 h-4 w-4" />
                        Import/Export
                    </Link>
                </Button>
            </DashboardHeader>
            <div className="space-y-4">
                <PostsFilter />
                <PostsTable />
            </div>
        </DashboardShell>
    );
}
