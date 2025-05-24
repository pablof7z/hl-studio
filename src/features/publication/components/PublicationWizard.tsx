'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Users, Hash, Image as ImageIcon, Camera, Edit3, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import NDKBlossom from '@nostr-dev-kit/ndk-blossom';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { useNDK, useNDKCurrentPubkey } from '@nostr-dev-kit/ndk-hooks';
import { NDKPublication } from '../event/publication';
import { PublicationCard } from './PublicationCard';
import { MentionModal } from '@/features/mention/components/MentionModal';
import { MentionEntity } from '@/features/mention/types';
import { HashtagInput } from '@/components/ui/hashtag-input';
import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import UserAvatar from '@/features/nostr/components/user/UserAvatar';

interface PublicationData {
    title: string;
    about: string;
    image: string;
    avatar: string;
    banner: string;
    category: string;
    hashtags: string[];
    authors: string[];
}

const CATEGORIES = [
    'Technology',
    'Business',
    'Science',
    'Health',
    'Arts',
    'Education',
    'Entertainment',
    'Sports',
    'Politics',
    'Lifestyle',
    'Travel',
    'Food',
    'Fashion',
    'Finance',
    'Other'
];

export function PublicationWizard() {
    const router = useRouter();
    const { ndk } = useNDK();
    const [step, setStep] = useState(1);
    const [isPublishing, setIsPublishing] = useState(false);
    const [mentionModalOpen, setMentionModalOpen] = useState(false);
    const [editingField, setEditingField] = useState<string | null>(null);
    const currentPubkey = useNDKCurrentPubkey();
    const profile = useProfileValue(currentPubkey);
    const [data, setData] = useState<PublicationData>({
        title: '',
        about: '',
        image: '',
        avatar: '',
        banner: '',
        category: '',
        hashtags: [],
        authors: []
    });

    useEffect(() => {
        if (!currentPubkey) return;

        setData(prev => {
            const data = {...prev};
            data.authors = [currentPubkey];
            if (profile) {
                if (data.title.trim().length === 0) data.title = `${profile.name}'s Publication`;
            }
            
            return data;
        });
    }, [currentPubkey, profile]);

    const handleNext = () => {
        if (step < 2 && data.title.trim()) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            router.push('/');
        }
    };

    const handlePublish = async () => {
        if (!ndk || !data.title) return;

        setIsPublishing(true);
        try {
            const publication = new NDKPublication(ndk);
            publication.title = data.title;
            publication.about = data.about;
            publication.image = data.image;
            publication.avatar = data.avatar;
            publication.banner = data.banner;
            publication.category = data.category;
            publication.hashtags = data.hashtags;
            publication.authors = data.authors;
            
            publication.publish();
            router.push('/');
        } catch (error) {
            console.error('Failed to publish publication:', error);
        } finally {
            setIsPublishing(false);
        }
    };

    const updateData = (field: keyof PublicationData, value: string | string[]) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleAuthorSelect = useCallback((entity: MentionEntity) => {
        if (entity.type === 'user' && entity.user) {
            const pubkey = entity.user.pubkey;
            if (!data.authors.includes(pubkey)) {
                setData(prev => ({
                    ...prev,
                    authors: [...prev.authors, pubkey]
                }));
            }
        }
        setMentionModalOpen(false);
    }, [data.authors]);

    const removeAuthor = (pubkey: string) => {
        setData(prev => ({
            ...prev,
            authors: prev.authors.filter(p => p !== pubkey)
        }));
    };

    const handleImageUpload = async (field: 'avatar' | 'banner' | 'image', e: React.ChangeEvent<HTMLInputElement>) => {
        if (!ndk) return;

        const file = e.target.files?.[0];
        if (!file) return;

        const blossom = new NDKBlossom(ndk as any);
        
        // Show preview immediately
        const reader = new FileReader();
        reader.onload = () => {
            updateData(field, reader.result as string);
        };
        reader.readAsDataURL(file);
        
        try {
            const imeta = await blossom.upload(file, { maxRetries: 3, server: 'https://nostr.download' });
            console.log('Image uploaded:', imeta);
            if (imeta?.url) {
                updateData(field, imeta.url);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            // Keep the preview image if upload fails
        }
    };

    const AuthorDisplay = ({ pubkey }: { pubkey: string }) => {
        const profile = useProfileValue(pubkey);
        return (
            <div className="flex items-center gap-2 group">
                <UserAvatar pubkey={pubkey} size="xs" />
                <span className="text-sm">{profile?.displayName || profile?.name || pubkey.slice(0, 8)}</span>
                {currentPubkey !== pubkey && (
                    <button
                        onClick={() => removeAuthor(pubkey)}
                        className="text-gray-500 hover:text-red-500 ml-1 group-hover:opacity-100 opacity-0 transition-opacity"
                    >
                        ×
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header with Back Button */}
            <div className="absolute top-6 left-6 z-10">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen p-6">
                <div className="w-full max-w-4xl">
                    {step === 1 && (
                        <div className="text-center space-y-8">
                            <div className="space-y-6">
                                <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                                    Start your own publication
                                </h1>
                                
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                    Publications enable you to house all your content under a single brand, 
                                    create community, and collaborate with other authors.
                                </p>
                            </div>

                            <div className="space-y-6 max-w-xl mx-auto">
                                <div className="text-left">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        What should we call your publication?
                                    </h2>
                                    
                                    <Input
                                        value={data.title}
                                        onChange={(e) => updateData('title', e.target.value)}
                                        placeholder="Enter your publication title"
                                        className="!text-xl !ring-0 !outline-0 border-0 bg-transparent"
                                    />
                                </div>

                                <Button
                                    onClick={handleNext}
                                    disabled={!data.title.trim()}
                                    size="lg"
                                    className="text-xl p-6 px-10"
                                >
                                    Next
                                    <ArrowRight />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    Customize Your Publication
                                </h1>
                                <p className="text-lg text-gray-600">
                                    Click on any element below to edit it
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* WYSIWYG Preview */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold text-gray-900">Preview</h2>
                                    
                                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                                        {/* Banner */}
                                        <Label htmlFor="banner-upload" className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500 cursor-pointer group block">
                                            {data.banner ? (
                                                <img src={data.banner} alt="Banner" className="w-full h-full object-cover" />
                                            ) : null}
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera className="w-6 h-6 mx-auto mb-1" />
                                                    <span className="text-sm">
                                                        Click to change banner
                                                    </span>
                                                </div>
                                            </div>
                                        </Label>
                                        <Input
                                            id="banner-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageUpload('banner', e)}
                                        />

                                        <div className="p-6 space-y-4">
                                            {/* Avatar and Title */}
                                            <div className="flex items-start gap-4">
                                                <Label htmlFor="avatar-upload" className="relative w-16 h-16 bg-gray-200 rounded-full cursor-pointer group flex-shrink-0 block">
                                                    {data.avatar ? (
                                                        <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                                                            <ImageIcon className="w-6 h-6 text-gray-500" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-full flex items-center justify-center">
                                                        <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </Label>
                                                <Input
                                                    id="avatar-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleImageUpload('avatar', e)}
                                                />

                                                <div className="flex-1">
                                                    {editingField === 'title' ? (
                                                        <Input
                                                            value={data.title}
                                                            onChange={(e) => updateData('title', e.target.value)}
                                                            onBlur={() => setEditingField(null)}
                                                            onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                                                            autoFocus
                                                            className="text-xl font-bold"
                                                        />
                                                    ) : (
                                                        <h3 
                                                            className="text-xl font-bold text-gray-900 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1 group"
                                                            onClick={() => setEditingField('title')}
                                                        >
                                                            {data.title}
                                                            <Edit3 className="w-4 h-4 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </h3>
                                                    )}

                                                    {/* Category */}
                                                    <div className="mt-2">
                                                        <Select value={data.category} onValueChange={(value) => updateData('category', value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {CATEGORIES.map(category => (
                                                                    <SelectItem key={category} value={category}>
                                                                        {category}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* About */}
                                            <div>
                                                {editingField === 'about' ? (
                                                    <Textarea
                                                        value={data.about}
                                                        onChange={(e) => updateData('about', e.target.value)}
                                                        onBlur={() => setEditingField(null)}
                                                        placeholder="Describe your publication..."
                                                        autoFocus
                                                        rows={3}
                                                    />
                                                ) : (
                                                    <p 
                                                        className="text-gray-600 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1 group min-h-[2rem] flex items-center"
                                                        onClick={() => setEditingField('about')}
                                                    >
                                                        {data.about || 'Click to add description...'}
                                                        <Edit3 className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </p>
                                                )}
                                            </div>

                                            {/* Hashtags */}
                                            <div className="space-y-2 flex-grow w-full">
                                                <HashtagInput
                                                    hashtags={data.hashtags}
                                                    onHashtagsChange={(hashtags) => updateData('hashtags', hashtags)}
                                                    placeholder="+ Add hashtag"
                                                    className="flex-1"
                                                />
                                            </div>

                                            {/* Authors */}
                                            <div>
                                                <div className="flex flex-wrap gap-2">
                                                    {data.authors.map(pubkey => (
                                                        <AuthorDisplay key={pubkey} pubkey={pubkey} />
                                                    ))}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setMentionModalOpen(true)}
                                                        className="rounded-full"
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Publication Card Preview */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold text-gray-900">Card Preview</h2>
                                    <PublicationCard publication={data} />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center pt-8">
                                <Button
                                    onClick={handlePublish}
                                    disabled={isPublishing || !data.title.trim()}
                                    size="lg"
                                    className="font-bold text-lg p-6 px-10"
                                >
                                    {isPublishing ? 'Creating Publication...' : 'Create Publication'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <MentionModal
                open={mentionModalOpen}
                onSelect={handleAuthorSelect}
                onClose={() => setMentionModalOpen(false)}
            />

        </div>
    );
}