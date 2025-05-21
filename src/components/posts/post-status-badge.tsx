import { Badge } from '@/components/ui/badge';
import { Archive, CheckCircle, Clock, FileText } from 'lucide-react';

interface PostStatusBadgeProps {
    status: string;
}

export function PostStatusBadge({ status }: PostStatusBadgeProps) {
    switch (status) {
        case 'published':
            return (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Published
                </Badge>
            );
        case 'draft':
            return (
                <Badge variant="outline">
                    <FileText className="mr-1 h-3 w-3" />
                    Draft
                </Badge>
            );
        case 'scheduled':
            return (
                <Badge variant="secondary">
                    <Clock className="mr-1 h-3 w-3" />
                    Scheduled
                </Badge>
            );
        case 'archived':
            return (
                <Badge variant="outline" className="text-muted-foreground">
                    <Archive className="mr-1 h-3 w-3" />
                    Archived
                </Badge>
            );
        default:
            return null;
    }
}
