'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useState } from 'react';

interface ImageUploadProps {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    aspectRatio?: string;
    width?: number;
    height?: number;
}

export function ImageUpload({ value, onChange, aspectRatio = '1:1' }: ImageUploadProps) {
    const [isHovering, setIsHovering] = useState(false);

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(undefined);
    };

    // In a real app, this would upload to a storage service
    const handleUpload = () => {
        // For demo purposes, we'll just use a placeholder image
        if (aspectRatio === '1:1') {
            onChange('/abstract-avatar.png');
        } else {
            onChange('/abstract-banner.png');
        }
    };

    return (
        <div className="space-y-4">
            <Card
                className={`relative overflow-hidden ${aspectRatio === '1:1' ? 'w-[150px] h-[150px]' : 'w-full h-[200px]'}`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <CardContent className="p-0 h-full">
                    {value ? (
                        <>
                            <Image
                                src={value || '/placeholder.svg'}
                                alt="Uploaded image"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            {isHovering && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleRemove}
                                        className="absolute top-2 right-2"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" onClick={handleUpload}>
                                        Change Image
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div
                            className="h-full w-full flex items-center justify-center bg-muted cursor-pointer"
                            onClick={handleUpload}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Upload Image</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
