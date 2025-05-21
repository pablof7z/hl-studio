import { createErrorResponse, validateNip98Auth } from '@/lib/nip98-middleware';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/me
 * Returns the pubkey of the authenticated user
 * Requires NIP-98 authentication
 */
export async function GET(req: NextRequest) {
    // Validate NIP-98 authentication
    const authResult = await validateNip98Auth(req);

    if (!authResult.valid) {
        return createErrorResponse(authResult.error || 'Authentication failed', authResult.status || 401);
    }

    // Get the pubkey from the auth result
    const { pubkey } = authResult;

    // Return just the pubkey
    return NextResponse.json({
        pubkey,
    });
}
