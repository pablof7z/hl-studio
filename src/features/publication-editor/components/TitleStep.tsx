'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

interface TitleStepProps {
    title: string;
    onTitleChange: (value: string) => void;
    onNext: () => void;
}

export function TitleStep({ title, onTitleChange, onNext }: TitleStepProps) {
    return (
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

            <div className="space-y-6 max-w-xl mx-auto border-t border-border mt-10 pt-10">
                <div className="text-left">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                        What should we call your publication?
                    </h2>
                    
                    <Input
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="Enter your publication title"
                        className="!text-xl !ring-0 !outline-0 border-0 bg-transparent text-center"
                    />
                </div>

                <Button
                    onClick={onNext}
                    disabled={!title.trim()}
                    size="lg"
                    className="text-xl p-6 px-10"
                >
                    Next
                    <ArrowRight />
                </Button>
            </div>
        </div>
    );
}