import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { fetchTweets } from "@/domains/tweets/slice";
import { TweetCard } from "@/domains/tweets/components/TweetCard";
import { TweetFeedSkeleton } from "@/domains/tweets/components/TweetSkeleton";
import type { AppDispatch, RootState } from "@/app/store";

const POLL_INTERVAL = 30_000;
const DEBOUNCE_MS = 5_000;

export function TweetFeed() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items = [],
    nextCursor,
    isLoading,
    error,
    hasFetched,
  } = useSelector((state: RootState) => state.tweets);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastFetchRef = useRef(0);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Initial fetch + polling + visibility-based refresh
  useEffect(() => {
    function doFetch() {
      const now = Date.now();
      if (now - lastFetchRef.current < DEBOUNCE_MS) return;
      lastFetchRef.current = now;
      dispatch(fetchTweets(undefined));
    }

    doFetch();

    const interval = setInterval(doFetch, POLL_INTERVAL);

    function handleVisibility() {
      if (document.visibilityState === "visible") doFetch();
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [dispatch]);

  // Infinite scroll via IntersectionObserver on sentinel element
  const loadMore = useCallback(() => {
    if (nextCursor && !isLoading) {
      dispatch(fetchTweets(nextCursor));
    }
  }, [dispatch, nextCursor, isLoading]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (isLoading && items.length === 0 && !hasFetched) {
    return <TweetFeedSkeleton />;
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
        <p className="text-lg font-semibold text-foreground">
          Aucun tweet pour l'instant
        </p>
        <p className="text-sm">Soyez le premier à poster !</p>
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence initial={false}>
        {items.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </AnimatePresence>

      <div ref={sentinelRef} className="py-6 flex justify-center">
        {isLoading && (
          <div className="size-5 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
        )}
      </div>
    </div>
  );
}
