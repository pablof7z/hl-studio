'use client';

import { ExportPosts } from '@/components/posts/import-export/export-posts';
import { ImportPosts } from '@/components/posts/import-export/import-posts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ImportExportTabs() {
    return (
        <Tabs defaultValue="import" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="import">Import</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>
            <TabsContent value="import">
                <ImportPosts />
            </TabsContent>
            <TabsContent value="export">
                <ExportPosts />
            </TabsContent>
        </Tabs>
    );
}
