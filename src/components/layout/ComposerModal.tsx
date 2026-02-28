import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { TweetComposer } from "@/domains/tweets/components/TweetComposer";
import { useWindowWidth } from "@/hooks/useWindowWidth";

interface ComposerModalProps {
  open: boolean;
  onClose: () => void;
}

export function ComposerModal({ open, onClose }: ComposerModalProps) {
  const width = useWindowWidth();
  const isDesktop = width >= 768;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {/* 
        We use a custom structure inside DialogContent to achieve 
        the specific mobile-fullscreen / desktop-centered look.
      */}
      <DialogContent
        showCloseButton={false}
        className={`
          flex flex-col gap-0 p-0 overflow-hidden outline-none bg-background
          fixed z-50
          duration-300 ease-in-out
          ${
            isDesktop
              ? "w-full max-w-150 rounded-2xl border border-border min-h-62.5 shadow-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
              : "w-full h-dvh max-w-none rounded-none border-none shadow-none bottom-0 inset-10 left-0 right-0 top-0 m-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
          }
        `}
      >
        <DialogTitle className="sr-only">Nouveau tweet</DialogTitle>

        {/* Header */}
        <div className="flex items-center px-4 h-14 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <DialogClose asChild>
            <button
              className="p-2 -ml-2 rounded-full hover:bg-accent hover:text-foreground transition-colors text-muted-foreground mr-4"
              aria-label="Fermer"
            >
              <X className="size-5" />
            </button>
          </DialogClose>
          <div className="font-bold text-lg text-foreground">Nouveau tweet</div>
        </div>

        {/* Composer wrapper */}
        <div className="flex-1 overflow-y-auto">
          <TweetComposer autoFocus onSuccess={onClose} isModal />
        </div>
      </DialogContent>
    </Dialog>
  );
}
