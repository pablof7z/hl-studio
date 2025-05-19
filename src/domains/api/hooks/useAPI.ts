import { useCallback } from 'react';
import { useNDK, useNDKCurrentPubkey } from '@nostr-dev-kit/ndk-hooks';
import { NDKEvent } from '@nostr-dev-kit/ndk';

// NIP-98 HTTP Auth kind
const NIP98_KIND = 27235;

interface APIOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: Record<string, string>;
}

/**
 * Hook for making authenticated API requests using NIP-98
 * 
 * @example
 * const api = useAPI();
 * const result = await api('/api/me');
 */
export function useAPI() {
    const { ndk } = useNDK();
    const pubkey = useNDKCurrentPubkey();

    const fetchWithAuth = useCallback(async (url: string, options: APIOptions = {}) => {
        if (!ndk || !pubkey) {
            throw new Error('NDK not initialized or user not logged in');
        }

        const method = options.method || 'GET';
        const absoluteUrl = new URL(url, window.location.origin).toString();
        
        // Create a NIP-98 event
        const authEvent = new NDKEvent(ndk);
        authEvent.kind = NIP98_KIND;
        authEvent.content = '';
        authEvent.tags = [
            ['u', absoluteUrl],
            ['method', method]
        ];
        
        // Add payload hash if there's a body
        if (options.body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            const bodyText = typeof options.body === 'string' 
                ? options.body 
                : JSON.stringify(options.body);
            
            // Calculate SHA-256 hash of the body
            const encoder = new TextEncoder();
            const data = encoder.encode(bodyText);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            authEvent.tags.push(['payload', hashHex]);
        }
        
        // Sign the event
        await authEvent.sign();
        
        // Convert the event to base64 for the Authorization header
        const eventJSON = JSON.stringify(authEvent.rawEvent());
        const base64Event = btoa(eventJSON);
        
        // Prepare headers
        const headers: Record<string, string> = {
            ...options.headers,
            'Authorization': `Nostr ${base64Event}`
        };
        
        // If we have a body, add the content-type header if not already set
        if (options.body && !headers['Content-Type'] && typeof options.body !== 'string') {
            headers['Content-Type'] = 'application/json';
        }
        
        // Make the request
        const response = await fetch(absoluteUrl, {
            method,
            headers,
            body: options.body ? 
                (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) 
                : undefined
        });
        
        // Handle response
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        // Parse response based on content-type
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }
        
        return response.text();
    }, [ndk, pubkey]);
    
    return fetchWithAuth;
}