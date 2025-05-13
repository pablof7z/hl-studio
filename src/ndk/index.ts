// src/ndk/index.ts
import NDK from "@nostr-dev-kit/ndk";
import relays from "./config";

const ndk = new NDK({ explicitRelayUrls: relays });
ndk.connect();

export default ndk;