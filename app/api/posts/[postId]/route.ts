import { NextRequest, NextResponse } from "next/server";
import { fetchPosts } from "@/hooks/use-posts";

export async function GET(request: NextRequest) {
    try {
        // Extract pagination parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        const posts = await fetchPosts(page, limit);

        return NextResponse.json(posts, {
            status: 200,
            headers: {
                "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Posts fetch error:", error);

        return NextResponse.json(
            {
                error: "Failed to fetch posts",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
