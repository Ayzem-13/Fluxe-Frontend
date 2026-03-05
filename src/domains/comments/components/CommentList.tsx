import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { fetchComments } from "@/domains/comments/slice";
import type { AppDispatch, RootState } from "@/app/store";
import { CommentCard } from "./CommentCard";

interface CommentListProps {
  tweetId: string;
}

export function CommentList({ tweetId }: CommentListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const commentsByTweetId = useSelector(
    (state: RootState) => state.comments.byTweetId,
  );
  const isLoadingByTweetId = useSelector(
    (state: RootState) => state.comments.isLoading,
  );

  const comments = useMemo(
    () => commentsByTweetId[tweetId] ?? [],
    [commentsByTweetId, tweetId],
  );
  const isLoading = useMemo(
    () => isLoadingByTweetId[tweetId] ?? false,
    [isLoadingByTweetId, tweetId],
  );

  useEffect(() => {
    if (comments.length === 0 && !isLoading) {
      dispatch(fetchComments({ tweetId }));
    }
  }, [tweetId, dispatch, comments.length, isLoading]);

  if (comments.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <p className="text-sm">Aucun commentaire</p>
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence mode="popLayout">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} tweetId={tweetId} />
        ))}
      </AnimatePresence>
    </div>
  );
}
