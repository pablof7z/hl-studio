'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEditorStore } from '../../stores';

export function MetadataSection() {
    const { title, summary, setTitle, setSummary } = useEditorStore();

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    placeholder="Enter article title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                    id="summary"
                    placeholder="Enter a brief summary of your article"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={4}
                />
                <p className="text-xs text-muted-foreground">
                    A good summary helps readers understand what your article is about.
                </p>
            </div>
        </div>
    );
}
