import { useState } from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Heart, Trash2, Pencil, X, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { deleteTweet, updateTweet, likeTweet } from "@/domains/tweets/slice";
import type { Tweet } from "@/domains/tweets/types";
import type { AppDispatch, RootState } from "@/app/store";
import { timeAgo } from "@/utils/timeAgo";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TweetCardProps {
  tweet: Tweet;
}

function Avatar({
  username,
  avatar,
}: {
  username: string;
  avatar: string | null;
}) {
  const [imgError, setImgError] = useState(false);

  if (avatar && !imgError) {
    return (
      <img
        src={avatar}
        alt={username}
        className="size-10 rounded-full object-cover ring-2 ring-border"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className="size-10 rounded-full bg-sky-500/15 ring-2 ring-border flex items-center justify-center shrink-0">
      <span className="text-sky-400 font-bold text-sm uppercase select-none">
        {username.slice(0, 2)}
      </span>
    </div>
  );
}

export function TweetCard({ tweet }: TweetCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isOwner = currentUser?.id === tweet.authorId;
  const isLiked = tweet.likes.some((l) => l.userId === currentUser?.id);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  const [isSaving, setIsSaving] = useState(false);

  async function handleDeleteConfirm() {
    const res = await dispatch(deleteTweet(tweet.id));
    if (deleteTweet.fulfilled.match(res)) {
      toast.success("Tweet supprimé");
    } else {
      toast.error("Erreur lors de la suppression");
    }
  }

  async function handleEditSave() {
    const trimmed = editContent.trim();
    if (!trimmed || trimmed === tweet.content) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    const res = await dispatch(updateTweet({ id: tweet.id, content: trimmed }));
    setIsSaving(false);
    if (updateTweet.fulfilled.match(res)) {
      toast.success("Tweet modifié");
      setIsEditing(false);
    } else {
      toast.error("Erreur lors de la modification");
    }
  }

  function handleEditCancel() {
    setEditContent(tweet.content);
    setIsEditing(false);
  }

  const remaining = 280 - editContent.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="px-4 py-3 border-b border-border hover:bg-accent/20 transition-colors"
    >
      <div className="flex gap-3">
        <Avatar username={tweet.author.username} avatar={tweet.author.avatar} />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <span className="font-bold text-[15px] text-foreground truncate">
                {tweet.author.username}
              </span>
              <span className="text-muted-foreground text-sm truncate">
                @{tweet.author.username}
              </span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm shrink-0">
                {timeAgo(tweet.createdAt)}
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 rounded-full text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="size-3.5" />
                    </motion.button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[320px] max-w-[90vw] rounded-[24px] p-8 gap-6 shadow-xl border-none">
                    <AlertDialogHeader className="text-left space-y-2">
                      <AlertDialogTitle className="text-xl font-extrabold w-full">
                        Supprimer post ?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-[15px] text-muted-foreground leading-snug w-full">
                        Il n'est pas possible d'annuler cette opération. Ce post
                        sera supprimé de votre profil, du fil des comptes qui
                        vous suivent et des résultats de recherche.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex flex-col gap-3 w-full mt-2">
                      <AlertDialogPrimitive.Action asChild>
                        <button
                          onClick={handleDeleteConfirm}
                          className="w-full flex items-center justify-center rounded-full bg-[#f4212e] hover:bg-[#e01e2a] text-white font-bold h-12 text-[15px] shadow-none border-none cursor-pointer outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-background transition-colors"
                        >
                          Supprimer
                        </button>
                      </AlertDialogPrimitive.Action>
                      <AlertDialogPrimitive.Cancel asChild>
                        <button className="w-full flex items-center justify-center rounded-full border border-border/50 hover:bg-accent hover:text-foreground text-foreground font-bold h-12 text-[15px] shadow-none bg-transparent cursor-pointer outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-colors m-0">
                          Annuler
                        </button>
                      </AlertDialogPrimitive.Cancel>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* Content / Edit */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="mt-2 space-y-2"
                >
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    maxLength={300}
                    rows={3}
                    autoFocus
                    className="resize-none text-sm focus-visible:ring-sky-500 bg-background/50 backdrop-blur-sm shadow-inner transition-colors border-2 focus-visible:border-sky-500 rounded-xl"
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
                        onClick={handleEditCancel}
                        className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        aria-label="Annuler"
                      >
                        <X className="size-4.5" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleEditSave}
                        disabled={
                          !editContent.trim() || remaining < 0 || isSaving
                        }
                        className="p-1.5 rounded-full text-sky-400 hover:bg-sky-400/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Enregistrer"
                      >
                        <Check className="size-4.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  key="content"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="mt-1 text-[15px] text-foreground leading-relaxed whitespace-pre-wrap "
                >
                  {tweet.content}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-1 mt-2 -ml-1.5">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => dispatch(likeTweet(tweet.id))}
                className={cn(
                  "flex items-center gap-1.5 px-1.5 py-1 rounded-full transition-colors group",
                  isLiked
                    ? "text-red-400"
                    : "text-muted-foreground hover:text-red-400 hover:bg-red-400/10",
                )}
                aria-label={isLiked ? "Ne plus liker" : "Liker"}
              >
                <Heart
                  className={cn(
                    "size-4 transition-transform group-hover:scale-110",
                    isLiked && "fill-current",
                  )}
                />
                <span className="text-xs">{tweet._count.likes}</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
