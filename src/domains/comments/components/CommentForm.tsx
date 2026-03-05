import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { createComment } from "@/domains/comments/slice";
import type { AppDispatch, RootState } from "@/app/store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CommentFormProps {
  tweetId: string;
  onSuccess?: () => void;
}

export function CommentForm({ tweetId, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(createComment({ content, tweetId }));

      if (createComment.fulfilled.match(result)) {
        setContent("");
        toast.success("Commentaire publié");
        onSuccess?.();
      } else {
        toast.error("Erreur lors de la publication du commentaire");
      }
    } catch {
      toast.error("Erreur lors de la publication du commentaire");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const remaining = 280 - content.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 sm:gap-3 px-2 sm:px-4 py-3 sm:py-4"
    >
      <Avatar className="size-7 sm:size-8 shrink-0 ring-2 ring-border">
        <AvatarImage src={user.avatar ?? undefined} alt={user.username} />
        <AvatarFallback className="bg-sky-500/15 text-sky-500 text-xs font-bold">
          {user.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 flex flex-col gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ajoute un commentaire..."
          maxLength={280}
          className="flex-1 min-h-16 sm:min-h-20 resize-none rounded-lg sm:rounded-xl bg-muted/30 text-foreground text-sm sm:text-base placeholder-muted-foreground border border-border focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 px-3 sm:px-4 py-2 sm:py-3 outline-none transition-colors"
        />

        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-medium tabular-nums ${remaining <= 20 && remaining > 0 ? "text-yellow-500" : remaining < 0 ? "text-red-500" : "text-muted-foreground"}`}
          >
            {remaining}
          </span>

          <motion.button
            type="submit"
            disabled={isLoading || !content.trim() || remaining < 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-sky-500 text-white text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-600 transition-colors shadow-sm"
          >
            {isLoading ? (
              <div className="size-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="size-3 sm:size-4" />
            )}
            <span className="hidden sm:inline">Commenter</span>
            <span className="sm:hidden">Poster</span>
          </motion.button>
        </div>
      </div>
    </form>
  );
}
