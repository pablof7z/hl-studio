import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

// Define and export the specific settings type ScheduleIndicator needs
export interface ScheduleIndicatorSettings {
    date: Date; // Date is required for the indicator to make sense
    time: string;
    timezone: string;
    sendEmail: boolean;
    socialShare: {
        twitter: boolean;
        linkedin: boolean;
        facebook: boolean;
    };
    audienceType: 'all' | 'paid' | 'free';
}

interface ScheduleIndicatorProps {
    settings: ScheduleIndicatorSettings;
    className?: string;
}

export function ScheduleIndicator({ settings, className }: ScheduleIndicatorProps) {
    if (!settings.date) return null;

    const formattedDate = format(settings.date, 'MMM d, yyyy');
    const audienceLabel =
        settings.audienceType === 'all'
            ? 'All subscribers'
            : settings.audienceType === 'paid'
              ? 'Paid subscribers'
              : 'Free subscribers';

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge variant="outline" className={className}>
                        <Clock className="mr-1 h-3 w-3" />
                        Scheduled for {formattedDate} at {settings.time}
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="text-xs">
                        <p>
                            Scheduled for {formattedDate} at {settings.time}
                        </p>
                        <p>Timezone: {settings.timezone}</p>
                        <p>Audience: {audienceLabel}</p>
                        <p>Email notification: {settings.sendEmail ? 'Yes' : 'No'}</p>
                        {Object.entries(settings.socialShare).some(([, value]) => value) && (
                            <p>
                                Social sharing:
                                {settings.socialShare.twitter && ' Twitter'}
                                {settings.socialShare.linkedin && ' LinkedIn'}
                                {settings.socialShare.facebook && ' Facebook'}
                            </p>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
