import { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';

export type MentionEntityType = 'user' | 'event' | null;

export interface MentionEntity {
    type: MentionEntityType;
    user?: NDKUser;
    event?: NDKEvent;
    identifier?: string;
}
