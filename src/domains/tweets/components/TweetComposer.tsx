import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createTweet } from "@/domains/tweets/slice";
import type { AppDispatch, RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { cn } from "@/lib/utils";

const MAX = 280;
const MAX_HEIGHT = 200;

interface TweetComposerProps {
  onSuccess?: () => void;
  autoFocus?: boolean;
  isModal?: boolean;
}

export function TweetComposer({
  onSuccess,
  autoFocus,
  isModal,
}: TweetComposerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isCreating } = useSelector((state: RootState) => state.tweets);
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remaining = MAX - content.length;
  const isOverLimit = remaining < 0;
  const isEmpty = !content.trim();
  const showCounter = content.length > 0;

  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(content.length / MAX, 1);
  const dashOffset = circumference * (1 - progress);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  }, [content]);

  const insertEmoji = useCallback(
    (emoji: string) => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart ?? content.length;
      const end = el.selectionEnd ?? content.length;
      const newContent = content.slice(0, start) + emoji + content.slice(end);
      setContent(newContent);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + emoji.length;
        el.focus();
      });
    },
    [content],
  );

  async function handleSubmit() {
    if (isEmpty || isOverLimit || isCreating) return;
    const res = await dispatch(createTweet({ content: content.trim() }));
    if (createTweet.fulfilled.match(res)) {
      setContent("");
      toast.success("Tweet publié !");
      onSuccess?.();
    } else {
      toast.error("Impossible de publier le tweet");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  }

  return (
    <div
      className={cn("px-4 pt-4 pb-3 flex flex-col", isModal && "flex-1 h-full")}
    >
      <div className="flex gap-4 flex-1">
        {/* Avatar */}
        <div className="size-10 rounded-full bg-sky-500/15 ring-2 ring-border flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-sky-400 font-bold text-sm uppercase select-none">
            {user?.username?.slice(0, 2) ?? "?"}
          </span>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Quoi de neuf ?"
            maxLength={MAX}
            rows={isModal ? 4 : 1}
            autoFocus={autoFocus}
            className={cn(
              "resize-none border-none shadow-none bg-transparent placeholder:text-muted-foreground/60 focus:outline-none w-full leading-relaxed mb-4",
              isModal
                ? "text-xl sm:text-lg min-h-35"
                : "text-lg min-h-11",
            )}
            style={{ overflowY: "hidden" }}
          />
        </div>
      </div>

      {/* Footer / Toolbar */}
      <div className={cn("pt-2", isModal && "mt-auto")}>
        <Separator className="mb-3 opacity-50" />
        <div className="flex items-center justify-between gap-3">
          {/* Emoji picker */}
          <div className="-ml-2">
            <EmojiPicker onSelect={insertEmoji} />
          </div>

          <div className="flex items-center gap-4">
            <AnimatePresence>
              {showCounter && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <div className="relative size-6 flex items-center justify-center">
                    <svg width="24" height="24" className="-rotate-90">
                      <circle
                        cx="12"
                        cy="12"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-muted-foreground/20"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r={radius}
                        fill="none"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        className={cn(
                          "transition-all duration-300 ease-out",
                          isOverLimit
                            ? "stroke-red-500"
                            : remaining <= 20
                              ? "stroke-amber-500"
                              : "stroke-sky-500",
                        )}
                      />
                    </svg>
                  </div>
                  {remaining <= 20 && (
                    <span
                      className={cn(
                        "text-xs font-bold tabular-nums",
                        isOverLimit ? "text-red-500" : "text-amber-500",
                      )}
                    >
                      {remaining}
                    </span>
                  )}
                  {remaining <= 20 && (
                    <div className="h-4 w-px bg-border ml-1" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              onClick={handleSubmit}
              disabled={isEmpty || isOverLimit || isCreating}
              className={cn(
                "rounded-full font-bold shadow-sm transition-all duration-200",
                isModal ? "px-6 h-10 text-[15px]" : "px-5 h-9 text-sm",
              )}
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Publication…
                </span>
              ) : (
                "Poster"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
