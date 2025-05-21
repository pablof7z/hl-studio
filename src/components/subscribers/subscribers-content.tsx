'use client';

import { AddSubscribers } from '@/components/subscribers/add-subscribers';
import { ImportSubscribers } from '@/components/subscribers/import-subscribers';
import { SubscribersList } from '@/components/subscribers/subscribers-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Upload } from 'lucide-react';
import { useState } from 'react';

export function SubscribersContent() {
    const [activeTab, setActiveTab] = useState('list');

    return (
        <div className="space-y-6">
            <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="list">All Subscribers</TabsTrigger>
                        <TabsTrigger value="add">Add Subscribers</TabsTrigger>
                        <TabsTrigger value="import">Import</TabsTrigger>
                    </TabsList>

                    {activeTab === 'list' && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setActiveTab('import')}>
                                <Upload className="mr-2 h-4 w-4" />
                                Import
                            </Button>
                            <Button size="sm" onClick={() => setActiveTab('add')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Subscribers
                            </Button>
                        </div>
                    )}
                </div>

                <TabsContent value="list" className="mt-6">
                    <SubscribersList />
                </TabsContent>

                <TabsContent value="add" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Subscribers</CardTitle>
                            <CardDescription>Add subscribers manually via email or Nostr npub.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AddSubscribers />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="import" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Import Subscribers</CardTitle>
                            <CardDescription>Import subscribers from a file or other platforms.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImportSubscribers />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
