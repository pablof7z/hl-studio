import { NextRequest, NextResponse } from 'next/server';
import { NDKEvent } from '@nostr-dev-kit/ndk';

/**
 * NIP-98 middleware for Next.js API routes
 * Validates the NIP-98 Authorization header and extracts the pubkey
 */
export async function validateNip98Auth(req: NextRequest) {
    // Check if Authorization header exists
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Nostr ')) {
        return {
            valid: false,
            error: 'Missing or invalid Authorization header',
            status: 401
        };
    }

    try {
        // Extract and decode the base64 event
        const base64Event = authHeader.substring(6); // Remove 'Nostr ' prefix
        const eventJSON = atob(base64Event);
        const eventData = JSON.parse(eventJSON);
        
        // Create NDKEvent from the raw event data
        const event = new NDKEvent(undefined, eventData);
        
        // Validate event kind
        if (event.kind !== 27235) {
            return {
                valid: false,
                error: 'Invalid event kind, expected 27235',
                status: 401
            };
        }
        
        // Validate timestamp (within 60 seconds)
        const now = Math.floor(Date.now() / 1000);
        if (Math.abs(now - event.created_at) > 60) {
            return {
                valid: false,
                error: 'Event timestamp is too old or in the future',
                status: 401
            };
        }
        
        // Validate URL
        const urlTag = event.tags.find(tag => tag[0] === 'u');
        if (!urlTag) {
            return {
                valid: false,
                error: 'Missing URL tag',
                status: 401
            };
        }
        
        const requestUrl = new URL(req.url);
        const tagUrl = new URL(urlTag[1]);
        
        // Compare URLs (ignoring protocol differences between http/https in development)
        if (
            tagUrl.pathname !== requestUrl.pathname || 
            tagUrl.search !== requestUrl.search
        ) {
            return {
                valid: false,
                error: 'URL mismatch',
                status: 401
            };
        }
        
        // Validate method
        const methodTag = event.tags.find(tag => tag[0] === 'method');
        if (!methodTag) {
            return {
                valid: false,
                error: 'Missing method tag',
                status: 401
            };
        }
        
        if (methodTag[1] !== req.method) {
            return {
                valid: false,
                error: 'Method mismatch',
                status: 401
            };
        }
        
        // Validate payload hash if present (for POST/PUT/PATCH)
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            const payloadTag = event.tags.find(tag => tag[0] === 'payload');
            
            if (payloadTag) {
                const body = await req.text();
                const encoder = new TextEncoder();
                const data = encoder.encode(body);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                
                if (payloadTag[1] !== hashHex) {
                    return {
                        valid: false,
                        error: 'Payload hash mismatch',
                        status: 401
                    };
                }
            }
        }
        
        // Verify signature
        const isSignatureValid = await event.verifySignature(true);
        if (!isSignatureValid) {
            return {
                valid: false,
                error: 'Invalid signature',
                status: 401
            };
        }
        
        // All validations passed
        return {
            valid: true,
            pubkey: event.pubkey
        };
    } catch (error) {
        console.error('Error validating NIP-98 auth:', error);
        return {
            valid: false,
            error: 'Invalid NIP-98 event',
            status: 401
        };
    }
}

/**
 * Helper function to create a response with error details
 */
export function createErrorResponse(error: string, status: number) {
    return NextResponse.json(
        { error },
        { status }
    );
}