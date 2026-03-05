import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TweetCard } from "@/domains/tweets/components/TweetCard";
import { CommentForm } from "@/domains/comments/components/CommentForm";
import { CommentList } from "@/domains/comments/components/CommentList";
import { tweetsApi } from "@/domains/tweets/api";
import type { Tweet } from "@/domains/tweets/types";
import type { RootState } from "@/app/store";

export default function TweetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cachedTweet = useSelector((state: RootState) =>
    state.tweets.items.find((t) => t.id === id),
  );

  useEffect(() => {
    if (cachedTweet) {
      setTweet(cachedTweet);
      setIsLoading(false);
      return;
    }

    if (!id) return;

    setIsLoading(true);
    tweetsApi
      .getById(id)
      .then((res) => {
        setTweet(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Ce post n'existe pas ou a été supprimé.");
        setIsLoading(false);
      });
  }, [id, cachedTweet]);

  return (
    <AppLayout>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4 px-4 h-14">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1 rounded-full hover:bg-accent transition-colors text-foreground"
            aria-label="Retour"
          >
            <ArrowLeft className="size-5" />
          </motion.button>
          <h1 className="text-xl font-bold">Post</h1>
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="size-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p className="text-lg">{error}</p>
          <button
            onClick={() => navigate("/home")}
            className="mt-4 text-sky-500 hover:underline"
          >
            Retour au fil
          </button>
        </div>
      )}

      {tweet && !isLoading && (
        <div>
          <TweetCard tweet={tweet} />

          <div className="px-4 py-3 border-b border-border">
            <CommentForm tweetId={tweet.id} />
          </div>

          <CommentList tweetId={tweet.id} />
        </div>
      )}
    </AppLayout>
  );
}
