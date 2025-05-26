import NDK, { NDKEvent, NDKKind, NDKSigner, NDKUser, wrapEvent } from "@nostr-dev-kit/ndk";
import { ChartNoAxesColumnDecreasing } from "lucide-react";

export class NDKSchedule extends NDKEvent {
    public _event?: NDKEvent;
    
    constructor(ndk: NDK | undefined, event: NDKEvent) {
        super(ndk, event);
    }
    
    static from(event: NDKEvent): NDKSchedule {
        return new NDKSchedule(event?.ndk, event);
    }
    
    set event(e: NDKEvent) {
        this._event = e;

        this.prepareEvent();
    }

    async getEvent(signer?: NDKSigner) {
        if (this._event) return this._event;

        const _signer = signer || this.ndk?.signer;
        if (!_signer) throw new Error("No signer available");

        const pTag = this.tagValue("p");
        if (!pTag) return null;
        const cp = new NDKUser({ pubkey: pTag });

        try {
            await this.decrypt(cp, _signer);
            const payload = JSON.parse(this.content);

            // if it's an array, it's the legacy format
            if (Array.isArray(payload)) {
                const iTag = payload.find((tag: string[]) => tag[0] === "i");
                if (!iTag) throw new Error("No i-tag found: " + payload);
                this._event = await wrapEvent(new NDKEvent(this.ndk, JSON.parse(iTag[1])));
            } else {
                // new format
                const { event } = payload;
                this._event = await wrapEvent(new NDKEvent(this.ndk, event));
            }
            return this._event;
        } catch (e) {
            console.log("Failed to decrypt event: " + e);
        }
    }

    private prepareEvent() {
        if (!this._event) throw new Error("Event not set");

        this._event.kind = NDKKind.DVMEventSchedule;
        this._event.tags = this._event.tags.filter((tag) => tag[0] !== "a");
        this._event.tags.push(["a", "schedule:" + this.id]);
        this._event.content = JSON.stringify(this._event);
    }
}