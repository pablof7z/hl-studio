Whenever you make a mistake while using an interface or method, update this document to prevent yourself from making the same mistake. Keep notes short and focused.

* Don't import ndk-react, it doesn't exist, use @nostr-dev-kit/ndk-hooks
* Don't memoize filters for useSubscribe, pass false as the filter when the data to create the filter might not be available (e.g. useSubscribe(authors ? { authors } : false);

