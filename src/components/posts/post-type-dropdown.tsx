'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEditorStore } from '@/features/long-form-editor';
import { ChevronDown, FileText, MessageSquare, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PostTypeDropdownProps {
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    buttonText?: string;
    showIcon?: boolean;
}

export function PostTypeDropdown({
    variant = 'default',
    size = 'default',
    className,
    buttonText = 'New Post',
    showIcon = true,
}: PostTypeDropdownProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { reset } = useEditorStore();

    const handlePostTypeSelect = (type: 'thread' | 'long-form') => {
        setIsOpen(false);

        if (type === 'thread') {
            router.push('/editor/thread');
        } else {
            reset();
            router.push('/editor/post');
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size={size} className={className}>
                    {showIcon && <PlusCircle className="mr-2 h-4 w-4" />}
                    {buttonText}
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handlePostTypeSelect('long-form')} className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                        <span>Long-Form Post</span>
                        <span className="text-xs text-muted-foreground">Create a detailed article</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePostTypeSelect('thread')} className="cursor-pointer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                        <span>Thread</span>
                        <span className="text-xs text-muted-foreground">Create a series of connected posts</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
