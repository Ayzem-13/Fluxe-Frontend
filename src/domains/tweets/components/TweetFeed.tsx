import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { fetchTweets } from "@/domains/tweets/slice";
import { TweetCard } from "@/domains/tweets/components/TweetCard";
import { TweetFeedSkeleton } from "@/domains/tweets/components/TweetSkeleton";
import type { AppDispatch, RootState } from "@/app/store";
import { Pencil } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center py-32 px-4 gap-4">
        <div className="size-20 rounded-full bg-muted/50 flex items-center justify-center mb-2">
          <Pencil className="size-10 text-muted-foreground/40" />
        </div>
        <div className="text-center space-y-2 max-w-70">
          <p className="font-bold text-xl text-foreground">
            Aucun tweet pour l'instant
          </p>
          <p className="text-[15px] text-muted-foreground leading-snug">
            Soyez le premier à partager vos pensées avec le monde !
          </p>
        </div>
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
