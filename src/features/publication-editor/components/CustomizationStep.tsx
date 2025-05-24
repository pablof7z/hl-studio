'use client';

import { Button } from '@/components/ui/button';
import { PublicationCard } from '@/features/publication/components/PublicationCard';
import { usePublicationEditorStore } from '../stores';
import { PublicationPreview } from './PublicationPreview';

interface CustomizationStepProps {
    onPublish: () => void;
    isPublishing: boolean;
    onImageUpload: (field: 'banner' | 'image', e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddAuthor: () => void;
}

export function CustomizationStep({ 
    onPublish, 
    isPublishing, 
    onImageUpload,
    onAddAuthor
}: CustomizationStepProps) {
    const { 
        title, about, image, banner, category, hashtags, authors
    } = usePublicationEditorStore();

    // Create a publication data object for the PublicationCard
    const publicationData = {
        title,
        about,
        image,
        banner,
        category,
        hashtags,
        authors
    };

    return (
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
                    
                    <PublicationPreview 
                        onImageUpload={onImageUpload}
                        onAddAuthor={onAddAuthor}
                    />
                </div>

                {/* Publication Card Preview */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Card Preview</h2>
                    <PublicationCard publication={publicationData} />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center pt-8">
                <Button
                    onClick={onPublish}
                    disabled={isPublishing || !title.trim()}
                    size="lg"
                    className="font-bold text-lg p-6 px-10"
                >
                    {isPublishing ? 'Creating Publication...' : 'Create Publication'}
                </Button>
            </div>
        </div>
    );
}