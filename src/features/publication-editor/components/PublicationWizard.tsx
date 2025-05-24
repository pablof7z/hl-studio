'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useNDK, useNDKCurrentPubkey } from '@nostr-dev-kit/ndk-hooks';
import { NDKPublication } from '@/features/publication/event/publication';
import { MentionModal } from '@/features/mention/components/MentionModal';
import { MentionEntity } from '@/features/mention/types';
import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import { usePublicationEditorStore } from '../stores';
import { TitleStep } from './TitleStep';
import { CustomizationStep } from './CustomizationStep';

export function PublicationWizard() {
    const router = useRouter();
    const { ndk } = useNDK();
    const currentPubkey = useNDKCurrentPubkey();
    const profile = useProfileValue(currentPubkey);
    const [isPublishing, setIsPublishing] = useState(false);
    const [mentionModalOpen, setMentionModalOpen] = useState(false);
    
    // Get state and actions from the store
    const { 
        step, title, about, image, banner, category, hashtags, authors,
        setStep, updateField, addAuthor, removeAuthor, uploadImage
    } = usePublicationEditorStore();

    useEffect(() => {
        if (!currentPubkey) return;

        if (authors.length === 0) {
            addAuthor(currentPubkey);
        }
        
        if (profile && title.trim().length === 0) {
            updateField('title', `${profile.name}'s Publication`);
        }
    }, [currentPubkey, profile, authors.length, title, addAuthor, updateField]);

    const handleNext = () => {
        if (step < 2 && title.trim()) {
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
        if (!ndk || !title) return;

        setIsPublishing(true);
        try {
            const publication = new NDKPublication(ndk);
            publication.title = title;
            publication.about = about;
            publication.image = image;
            publication.banner = banner;
            publication.category = category;
            publication.hashtags = hashtags;
            publication.authors = authors;
            
            publication.publish();
            router.push('/');
        } catch (error) {
            console.error('Failed to publish publication:', error);
        } finally {
            setIsPublishing(false);
        }
    };

    const handleAuthorSelect = (entity: MentionEntity) => {
        if (entity.type === 'user' && entity.user) {
            const pubkey = entity.user.pubkey;
            if (!authors.includes(pubkey)) {
                addAuthor(pubkey);
            }
        }
        setMentionModalOpen(false);
    };

    const handleImageUpload = async (field: 'banner' | 'image', e: React.ChangeEvent<HTMLInputElement>) => {
        if (!ndk) return;

        const file = e.target.files?.[0];
        if (!file) return;

        await uploadImage(field, file, ndk as any);
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
                        <TitleStep 
                            title={title}
                            onTitleChange={(value: string) => updateField('title', value)}
                            onNext={handleNext}
                        />
                    )}

                    {step === 2 && (
                        <CustomizationStep
                            onPublish={handlePublish}
                            isPublishing={isPublishing}
                            onImageUpload={handleImageUpload}
                            onAddAuthor={() => setMentionModalOpen(true)}
                        />
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