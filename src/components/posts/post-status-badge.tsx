import { Badge } from '@/components/ui/badge';
import { Archive, CheckCircle, Clock, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

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
        case 'incoming_proposal':
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Incoming Proposal
                </Badge>
            );
        case 'outgoing_proposal':
            return (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100">
                    <ArrowRight className="mr-1 h-3 w-3" />
                    Outgoing Proposal
                </Badge>
            );
        default:
            return null;
    }
}
