import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { validateNip98Auth, createErrorResponse } from "@/lib/nip98-middleware";
import { updatePostStatus, deletePost, getPostByIdForUser } from "@/domains/schedule/db";
import { PostStatus } from "@/domains/db/schema";

// Create Drizzle database instance
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    // Authenticate
    const auth = await validateNip98Auth(req);
    if (!auth.valid || !auth.pubkey) {
        return createErrorResponse(auth.error ?? "Unauthorized", auth.status ?? 401);
    }
    const pubkey = auth.pubkey;

    let data: { status?: string; publishError?: string | null; publishAttemptedAt?: string | null };
    try {
        data = await req.json();
    } catch {
        return createErrorResponse("Invalid JSON body", 400);
    }

    // Validate at least status is present
    if (typeof data.status !== "string") {
        return createErrorResponse("Missing required field: status", 400);
    }

    // Check post ownership efficiently
    const post = await getPostByIdForUser(db, id, pubkey);
    if (!post) {
        return createErrorResponse("Post not found or not owned by user", 404);
    }

    try {
        const updated = await updatePostStatus(
            db,
            id,
            data.status as PostStatus,
            {
                publishError: data.publishError ?? null,
                publishAttemptedAt: data.publishAttemptedAt ?? null,
            }
        );
        if (!updated) {
            return createErrorResponse("Failed to update post", 404);
        }
        return NextResponse.json({ post: updated });
    } catch {
        return createErrorResponse("Failed to update post", 500);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    // Authenticate
    const auth = await validateNip98Auth(req);
    if (!auth.valid || !auth.pubkey) {
        return createErrorResponse(auth.error ?? "Unauthorized", auth.status ?? 401);
    }
    const pubkey = auth.pubkey;

    // Check post ownership efficiently
    const post = await getPostByIdForUser(db, id, pubkey);
    if (!post) {
        return createErrorResponse("Post not found or not owned by user", 404);
    }

    try {
        const deleted = await deletePost(db, id);
        if (!deleted) {
            return createErrorResponse("Failed to delete post", 404);
        }
        return NextResponse.json({ post: deleted });
    } catch {
        return createErrorResponse("Failed to delete post", 500);
    }
}