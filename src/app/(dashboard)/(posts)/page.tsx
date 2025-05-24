'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PostsTable } from '@/components/posts/posts-table';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { useArticles, useArticlesStore } from '@/domains/articles';
import { useDraftStore } from '@/features/drafts/stores';

export default function PostsPage() {
    return (
        <DashboardShell>
            <DashboardHeader heading="Posts" text="Manage your content on Highlighter">
            </DashboardHeader>
            <div className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <TotalPosts />
                </div>
                {/* <PostsFilter /> */}
                <PostsTable />
            </div>
        </DashboardShell>
    );
}


function TotalPosts() {
    const published = useArticlesStore((state) => state.published);
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Articles</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{published.length}</div>
            </CardContent>
        </Card>
    )
}

function TotalDrafts() {
    const drafts = useDraftStore((state) => state.items);
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{Object.keys(drafts).length}</div>
            </CardContent>
        </Card>
    )
}