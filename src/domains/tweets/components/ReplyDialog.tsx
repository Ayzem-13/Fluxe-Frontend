import { X, Repeat2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CommentForm } from "@/domains/comments/components/CommentForm";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { timeAgo } from "@/utils/timeAgo";
import type { TweetAuthor } from "@/domains/tweets/types";

interface ReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tweetId: string;
  author: TweetAuthor;
  content: string;
  date: string;
  isRetweet?: boolean;
  retweetAuthor?: TweetAuthor;
}

export function ReplyDialog({
  open,
  onOpenChange,
  tweetId,
  author,
  content,
  date,
  isRetweet = false,
  retweetAuthor,
}: ReplyDialogProps) {
  const width = useWindowWidth();
  const isDesktop = width >= 640;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={`
          flex flex-col gap-0 p-0 overflow-hidden outline-none bg-background
          fixed z-50
          duration-300 ease-in-out
          ${isDesktop
            ? "w-full max-w-xl rounded-2xl border border-border max-h-[85vh] shadow-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            : "w-full h-dvh max-w-none rounded-none border-none shadow-none bottom-0 inset-10 left-0 right-0 top-0 m-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0">
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 -ml-1 rounded-full hover:bg-accent transition-colors text-muted-foreground"
          >
            <X className="size-5" />
          </button>
          <DialogTitle className="text-lg font-bold">Réponses</DialogTitle>
          <DialogDescription className="sr-only">
            Répondre à ce post
          </DialogDescription>
        </div>

        {/* Retweet indicator */}
        {isRetweet && retweetAuthor && (
          <div className="flex items-center gap-1.5 px-4 pt-2 text-xs text-muted-foreground border-b border-border">
            <Repeat2 className="size-3.5" />
            <span>{retweetAuthor.username} a retweeté</span>
          </div>
        )}

        {/* Original tweet context */}
        <div className="flex gap-3 px-4 py-3 shrink-0">
          <Avatar className="size-10 ring-2 ring-border shrink-0">
            <AvatarImage
              src={author.avatar ?? undefined}
              alt={author.username}
            />
            <AvatarFallback className="bg-sky-500/15 text-sky-500 font-bold text-sm">
              {author.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px]">{author.username}</span>
              <span className="text-muted-foreground text-sm">
                @{author.username}
              </span>
              <span className="text-muted-foreground text-sm">
                · {timeAgo(date)}
              </span>
            </div>
            <p className="text-[15px] text-foreground leading-relaxed mt-1 whitespace-pre-wrap">
              {content}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              En réponse à{" "}
              <span className="text-sky-500">@{author.username}</span>
            </p>
          </div>
        </div>

        <div className="border-t border-border shrink-0">
          <CommentForm
            tweetId={tweetId}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
