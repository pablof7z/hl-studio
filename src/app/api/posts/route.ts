import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { validateNip98Auth, createErrorResponse } from "@/lib/nip98-middleware";
import { createPost, getUserPosts, NewPostInput } from "@/domains/schedule/db";
import { PostStatus } from "@/domains/db/schema";

// Create Drizzle database instance
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

// Ensure DB schema is up-to-date before any queries
import { runMigrations } from "@/domains/db/runMigrations";
runMigrations(db);

export async function GET(req: NextRequest) {
    // Authenticate
    const auth = await validateNip98Auth(req);
    console.log("auth", auth);
    if (!auth.valid || !auth.pubkey) {
        return createErrorResponse(auth.error ?? "Unauthorized", auth.status ?? 401);
    }
    const pubkey = auth.pubkey;

    // Parse query params (optional: status, limit, offset)
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as PostStatus | null;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined;

    try {
        const posts = await getUserPosts(db, {
            accountPubkey: pubkey,
            status: status ?? undefined,
            limit,
            offset,
        });
        return NextResponse.json({ posts });
    } catch {
        return createErrorResponse("Failed to fetch posts", 500);
    }
}

export async function POST(req: NextRequest) {
    // Authenticate
    const auth = await validateNip98Auth(req);
    console.log("auth", auth);
    if (!auth.valid || !auth.pubkey) {
        return createErrorResponse(auth.error ?? "Unauthorized", auth.status ?? 401);
    }
    const pubkey = auth.pubkey;

    // Use the parsed JSON payload from the middleware
    const data: Partial<NewPostInput> | undefined = auth.json;
    if (!data) {
        return createErrorResponse("Invalid or missing JSON body", 400);
    }

    // Validate required fields (authorPubkey is set by server, not client)
    if (
        typeof data.status !== "string" ||
        typeof data.rawEvent !== "string"
    ) {
        return createErrorResponse("Missing required fields: status, rawEvent", 400);
    }

    // Compose input (authorPubkey is always set to authenticated pubkey)
    const input: NewPostInput = {
        accountPubkey: pubkey,
        authorPubkey: pubkey,
        scheduledAt: data.scheduledAt ?? null,
        relays: data.relays ?? null,
        status: data.status as PostStatus,
        rawEvent: data.rawEvent,
        publishAttemptedAt: data.publishAttemptedAt ?? null,
        publishError: data.publishError ?? null,
    };
    console.log("input", input);

    try {
        const post = await createPost(db, input);
        return NextResponse.json({ post }, { status: 200 });
    } catch(e) {
        console.error("Error creating post:", e);
        return createErrorResponse("Failed to create post", 500);
    }
}