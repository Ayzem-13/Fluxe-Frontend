import { Skeleton } from "@/components/ui/skeleton";

export function TweetSkeleton() {
  return (
    <div className="px-4 py-3 border-b border-border">
      <div className="flex gap-3">
        <Skeleton className="size-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
        </div>
      </div>
    </div>
  );
}

export function TweetFeedSkeleton() {
  return (
    <div>
      {Array.from({ length: 6 }).map((_, i) => (
        <TweetSkeleton key={i} />
      ))}
    </div>
  );
}
