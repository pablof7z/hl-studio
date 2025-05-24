This LEARN.md file representings high-level concepts that have been learned through working on things the user has explained. Understanding what different high-level concepts translate to in terms of implementation, or understanding how implementations work will help.

Whenever the user explains something in a clear way, particularly where they correct a misunderstanding, write those learnings in this file.

# p-tagging
The user refers to "p-tagging" as adding a "p" tag to a nostr event, this means that an event has in the `tags` array an array like `[ "p", "<pubkey>" ]`.

# nostr drafts
Drafts in nostr are events that are encrypted in a way the author of the draft has access to. We use NDKDraft to interface with drafts, which packs encryption/decryption.

# nostr draft proposals
Draft proposals are draft events where two pubkeys have access to the encrypted payload. The sender encrypts p-tagging the recipient. NDKDraft supports this.