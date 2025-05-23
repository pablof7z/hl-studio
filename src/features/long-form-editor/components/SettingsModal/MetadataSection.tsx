'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEditorStore } from '../../stores';
import { SocialPreview } from '../SocialPreview';

export function MetadataSection() {
    return (
        <SocialPreview edit={true} />
    );
}
