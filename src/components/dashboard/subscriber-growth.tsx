'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type SubscriberGrowthProps = React.HTMLAttributes<HTMLDivElement>;

const data = [
    { name: 'Jan', subscribers: 400 },
    { name: 'Feb', subscribers: 600 },
    { name: 'Mar', subscribers: 800 },
    { name: 'Apr', subscribers: 1000 },
    { name: 'May', subscribers: 1400 },
    { name: 'Jun', subscribers: 1800 },
    { name: 'Jul', subscribers: 2200 },
    { name: 'Aug', subscribers: 2600 },
    { name: 'Sep', subscribers: 2845 },
];

export function SubscriberGrowth({ className, ...props }: SubscriberGrowthProps) {
    return (
        <Card className={cn('col-span-4', className)} {...props}>
            <CardHeader>
                <CardTitle>Subscriber Growth</CardTitle>
                <CardDescription>Your subscriber growth over time</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="9months">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="30days">30 days</TabsTrigger>
                            <TabsTrigger value="3months">3 months</TabsTrigger>
                            <TabsTrigger value="9months">9 months</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="30days" className="h-[300px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.slice(-3)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="subscribers" stroke="#6366F1" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </TabsContent>
                    <TabsContent value="3months" className="h-[300px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.slice(-5)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="subscribers" stroke="#6366F1" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </TabsContent>
                    <TabsContent value="9months" className="h-[300px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="subscribers" stroke="#6366F1" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
