/**
 * Enum of supported authentication methods.
 */
export enum AuthMethod {
    Nip07 = 'nip07',
    Nsec = 'nsec',
    Bunker = 'bunker',
    NostrConnect = 'nostrconnect',
}

/**
 * Auth error type for domain and feature layers.
 */
export interface AuthError {
    method: AuthMethod;
    message: string;
}
