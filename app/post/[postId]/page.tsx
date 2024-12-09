import { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import PostDetailView from "@/components/feed/post-page";

export default function PostPage({ params }: { params: { postId: string } }) {
  return (
    <Suspense fallback={<PostLoadingSkeleton />}>
      <PostDetailView postId={params.postId} />
    </Suspense>
  );
}

function PostLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}