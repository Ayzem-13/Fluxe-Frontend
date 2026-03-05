import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Trash2, Pencil, X, Check } from "lucide-react";
import { toast } from "sonner";
import { updateComment,deleteComment,likeComment} from "@/domains/comments/slice";
import type { AppDispatch, RootState } from "@/app/store";
import type { Comment } from "@/domains/comments/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { timeAgo } from "@/utils/timeAgo";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog";

interface CommentCardProps {
  comment: Comment;
  tweetId: string;
}

export function CommentCard({ comment, tweetId }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const isOwner = user?.id === comment.authorId;
  const isLiked = comment.likes.some((l) => l.userId === user?.id);

  const handleSave = async () => {
    if (!editContent.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }

    const result = await dispatch(
      updateComment({ id: comment.id, content: editContent }),
    );

    if (updateComment.fulfilled.match(result)) {
      toast.success("Commentaire modifié");
      setIsEditing(false);
    } else {
      toast.error("Erreur lors de la modification");
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteComment({ id: comment.id, tweetId }));
    if (deleteComment.fulfilled.match(result)) {
      toast.success("Commentaire supprimé");
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleLike = async () => {
    const result = await dispatch(likeComment({ id: comment.id, tweetId }));
    if (likeComment.rejected.match(result)) {
      toast.error("Erreur lors du like");
    }
  };

  const remaining = 280 - editContent.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 py-3 border-b border-border hover:bg-accent/20 transition-colors"
    >
      <div className="flex gap-3">
        <Avatar
          className="size-8 ring-2 ring-border cursor-pointer"
          onClick={() => navigate(`/profile/${comment.author.id}`)}
        >
          <AvatarImage
            src={comment.author.avatar ?? undefined}
            alt={comment.author.username}
          />
          <AvatarFallback className="bg-sky-500/15 text-sky-500 text-xs font-bold">
            {comment.author.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="font-bold text-[15px] hover:underline cursor-pointer truncate"
                onClick={() => navigate(`/profile/${comment.author.id}`)}
              >
                {comment.author.username}
              </span>
              <span className="text-muted-foreground text-sm">
                {timeAgo(comment.createdAt)}
              </span>
            </div>

            {isOwner && !isEditing && (
              <div className="flex items-center gap-0.5 shrink-0">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-sky-400 hover:bg-sky-400/10 transition-colors"
                  aria-label="Modifier"
                >
                  <Pencil className="size-3.5" />
                </motion.button>
                <DeleteConfirmDialog
                  trigger={
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 rounded-full text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="size-3.5" />
                    </motion.button>
                  }
                  title="Supprimer le commentaire ?"
                  description="Il n'est pas possible d'annuler cette opération. Ce commentaire sera définitivement supprimé."
                  onConfirm={handleDelete}
                />
              </div>
            )}
          </div>

          {/* Content / Edit */}
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={280}
                className="min-h-12 resize-none text-sm focus-visible:ring-sky-500 bg-background/50 backdrop-blur-sm shadow-inner transition-colors border-2 focus-visible:border-sky-500 rounded-xl"
              />
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-xs font-medium tabular-nums ml-1",
                    remaining <= 20 && remaining > 0 && "text-yellow-400",
                    remaining < 0 && "text-red-400",
                    remaining > 20 && "text-muted-foreground",
                  )}
                >
                  {remaining}
                </span>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEditing(false)}
                    className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    aria-label="Annuler"
                  >
                    <X className="size-4.5" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSave}
                    disabled={!editContent.trim() || remaining < 0}
                    className="p-1.5 rounded-full text-sky-400 hover:bg-sky-400/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Enregistrer"
                  >
                    <Check className="size-4.5" />
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[15px] text-foreground leading-relaxed mt-1 whitespace-pre-wrap wrap-break-word">
              {comment.content}
            </p>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-1 mt-2 -ml-1.5">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1.5 px-1.5 py-1 rounded-full transition-colors group",
                  isLiked
                    ? "text-red-400"
                    : "text-muted-foreground hover:text-red-400 hover:bg-red-400/10",
                )}
                aria-label={isLiked ? "Ne plus aimer" : "Aimer"}
              >
                <Heart
                  className={cn(
                    "size-4 transition-transform group-hover:scale-110",
                    isLiked && "fill-current",
                  )}
                />
                <span className="text-xs">{comment._count.likes}</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
