export interface ScheduledPost {
    id: string;
    title: string;
    excerpt?: string;
    type: 'long-form' | 'thread';
    scheduledFor: string; // ISO date string
    scheduledTime: string; // HH:MM format
    timezone: string;
    audienceType: 'all' | 'paid' | 'free';
    distribution: {
        email: boolean;
        twitter: boolean;
        linkedin: boolean;
        facebook: boolean;
    };
}

export const mockScheduledPosts: ScheduledPost[] = [
    {
        id: '1',
        title: 'How to Build a Loyal Audience',
        excerpt: 'Strategies for creating a community that keeps coming back...',
        type: 'long-form',
        scheduledFor: '2023-10-05T09:00:00Z',
        scheduledTime: '09:00',
        timezone: 'America/New_York',
        audienceType: 'all',
        distribution: {
            email: true,
            twitter: true,
            linkedin: false,
            facebook: false,
        },
    },
    {
        id: '2',
        title: 'Content Creation Tools I Use Daily',
        excerpt: 'A breakdown of the software and services that power my workflow...',
        type: 'thread',
        scheduledFor: '2023-10-12T10:30:00Z',
        scheduledTime: '10:30',
        timezone: 'America/New_York',
        audienceType: 'paid',
        distribution: {
            email: true,
            twitter: true,
            linkedin: true,
            facebook: false,
        },
    },
    {
        id: '3',
        title: 'Balancing Quality and Quantity',
        excerpt: 'Finding the right content cadence for your audience...',
        type: 'long-form',
        scheduledFor: '2023-10-19T09:00:00Z',
        scheduledTime: '09:00',
        timezone: 'America/New_York',
        audienceType: 'free',
        distribution: {
            email: true,
            twitter: false,
            linkedin: false,
            facebook: false,
        },
    },
    {
        id: '4',
        title: 'Engaging With Your Community',
        excerpt: 'How to foster meaningful interactions with your audience...',
        type: 'thread',
        scheduledFor: '2023-10-26T09:00:00Z',
        scheduledTime: '09:00',
        timezone: 'America/New_York',
        audienceType: 'all',
        distribution: {
            email: true,
            twitter: true,
            linkedin: true,
            facebook: true,
        },
    },
    {
        id: '5',
        title: 'The Future of Creator Monetization',
        excerpt: 'New models and opportunities for sustainable income...',
        type: 'long-form',
        scheduledFor: '2023-11-02T14:00:00Z',
        scheduledTime: '14:00',
        timezone: 'America/New_York',
        audienceType: 'paid',
        distribution: {
            email: true,
            twitter: true,
            linkedin: true,
            facebook: false,
        },
    },
    {
        id: '6',
        title: 'My Writing Process Explained',
        excerpt: 'A behind-the-scenes look at how I create content...',
        type: 'thread',
        scheduledFor: '2023-11-09T11:00:00Z',
        scheduledTime: '11:00',
        timezone: 'America/New_York',
        audienceType: 'all',
        distribution: {
            email: true,
            twitter: true,
            linkedin: false,
            facebook: false,
        },
    },
    {
        id: '7',
        title: '5 Lessons From My First Year as a Creator',
        excerpt: "What I've learned and what I'd do differently...",
        type: 'long-form',
        scheduledFor: '2023-11-16T09:00:00Z',
        scheduledTime: '09:00',
        timezone: 'America/New_York',
        audienceType: 'all',
        distribution: {
            email: true,
            twitter: true,
            linkedin: true,
            facebook: true,
        },
    },
    {
        id: '8',
        title: 'How I Organize My Content Calendar',
        excerpt: 'My system for planning and scheduling content...',
        type: 'thread',
        scheduledFor: '2023-11-23T15:30:00Z',
        scheduledTime: '15:30',
        timezone: 'America/New_York',
        audienceType: 'free',
        distribution: {
            email: true,
            twitter: true,
            linkedin: false,
            facebook: false,
        },
    },
    {
        id: '9',
        title: 'Building in Public: Benefits and Challenges',
        excerpt: 'Why sharing your journey can accelerate growth...',
        type: 'long-form',
        scheduledFor: '2023-11-30T10:00:00Z',
        scheduledTime: '10:00',
        timezone: 'America/New_York',
        audienceType: 'all',
        distribution: {
            email: true,
            twitter: true,
            linkedin: true,
            facebook: false,
        },
    },
    {
        id: '10',
        title: 'Repurposing Content Across Platforms',
        excerpt: 'How to maximize the value of everything you create...',
        type: 'thread',
        scheduledFor: '2023-12-07T13:00:00Z',
        scheduledTime: '13:00',
        timezone: 'America/New_York',
        audienceType: 'paid',
        distribution: {
            email: true,
            twitter: true,
            linkedin: true,
            facebook: true,
        },
    },
    // Add more posts on the same day to test multiple posts
    {
        id: '11',
        title: 'Morning Productivity Routine',
        excerpt: 'How I start my day for maximum focus...',
        type: 'thread',
        scheduledFor: '2023-10-05T07:00:00Z',
        scheduledTime: '07:00',
        timezone: 'America/New_York',
        audienceType: 'all',
        distribution: {
            email: false,
            twitter: true,
            linkedin: false,
            facebook: false,
        },
    },
    {
        id: '12',
        title: 'Evening Reflection Questions',
        excerpt: 'Questions I ask myself at the end of each day...',
        type: 'thread',
        scheduledFor: '2023-10-05T19:00:00Z',
        scheduledTime: '19:00',
        timezone: 'America/New_York',
        audienceType: 'free',
        distribution: {
            email: false,
            twitter: true,
            linkedin: false,
            facebook: false,
        },
    },
    {
        id: '13',
        title: 'Lunch Break Creativity Boost',
        excerpt: 'How to use your lunch break for creative thinking...',
        type: 'thread',
        scheduledFor: '2023-10-05T12:00:00Z',
        scheduledTime: '12:00',
        timezone: 'America/New_York',
        audienceType: 'all',
        distribution: {
            email: false,
            twitter: true,
            linkedin: false,
            facebook: false,
        },
    },
    {
        id: '14',
        title: 'Afternoon Focus Techniques',
        excerpt: 'How to maintain energy and focus in the afternoon...',
        type: 'thread',
        scheduledFor: '2023-10-05T15:00:00Z',
        scheduledTime: '15:00',
        timezone: 'America/New_York',
        audienceType: 'all',
        distribution: {
            email: false,
            twitter: true,
            linkedin: false,
            facebook: false,
        },
    },
];
