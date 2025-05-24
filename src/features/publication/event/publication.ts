import NDK, { NDKEvent, NDKKind, NDKRawEvent } from '@nostr-dev-kit/ndk-hooks';

export class NDKPublication extends NDKEvent {
    static kind = 34023;

    constructor(ndk?: NDK, rawEvent?: NDKRawEvent | NDKEvent) {
        super(ndk, rawEvent);
        this.kind = NDKPublication.kind;
    }

    static from(event: NDKEvent): NDKPublication {
        return new NDKPublication(event.ndk, event);
    }

    get title(): string {
        return this.getMatchingTags('title')[0]?.[1] || '';
    }

    set title(value: string) {
        this.removeTag('title');
        if (value) {
            this.tags.push(['title', value]);
        }
    }

    get about(): string | undefined {
        return this.tagValue('about');
    }

    set about(value: string) {
        this.removeTag('about');
        if (value) {
            this.tags.push(['about', value]);
        }
    }

    get image(): string | undefined {
        return this.tagValue('image');
    }

    set image(value: string | undefined) {
        this.removeTag('image');
        if (value) {
            this.tags.push(['image', value]);
        }
    }

    get avatar(): string | undefined {
        return this.tagValue('avatar');
    }

    set avatar(value: string | undefined) {
        this.removeTag('avatar');
        if (value) {
            this.tags.push(['avatar', value]);
        }
    }

    get banner(): string | undefined {
        return this.tagValue('banner');
    }

    set banner(value: string | undefined) {
        this.removeTag('banner');
        if (value) {
            this.tags.push(['banner', value]);
        }
    }

    get category(): string | undefined {
        return this.tagValue('category');
    }

    set category(value: string | undefined) {
        this.removeTag('category');
        if (value) {
            this.tags.push(['category', value]);
        }
    }

    get hashtags(): string[] {
        return this.getMatchingTags('t').map(tag => tag[1]).filter(Boolean);
    }

    set hashtags(value: string[]) {
        this.removeTag('t');
        value.forEach(hashtag => {
            if (hashtag) {
                this.tags.push(['t', hashtag]);
            }
        });
    }

    get authors(): string[] {
        return this.getMatchingTags('p').map(tag => tag[1]).filter(Boolean);
    }

    set authors(value: string[]) {
        this.removeTag('p');
        value.forEach(pubkey => {
            if (pubkey) {
                this.tags.push(['p', pubkey]);
            }
        });
    }
}