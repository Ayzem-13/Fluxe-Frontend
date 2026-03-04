import { useState } from "react";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { PostFab } from "@/components/layout/PostFab";
import { ComposerModal } from "@/components/layout/ComposerModal";
import { useNotificationPolling } from "@/hooks/useNotificationPolling";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [composerOpen, setComposerOpen] = useState(false);

  useNotificationPolling();

  return (
    <div className="flex w-full h-screen bg-background overflow-hidden relative">
      <header className="hidden md:flex grow justify-end h-screen z-10 shrink-0 min-w-0">
        <DesktopSidebar onCompose={() => setComposerOpen(true)} />
      </header>

      <main className="flex shrink-0 items-start justify-start h-screen overflow-hidden w-full md:w-150 lg:w-230 xl:w-247.5">
        <div className="w-full md:w-150 md:max-w-150 md:shrink-0 h-full border-r border-border overflow-y-auto pb-20 md:pb-0 hide-scrollbar">
          {children}
        </div>

        <div className="hidden lg:block w-72.5 xl:w-87.5 shrink-0 ml-8 mr-4 h-full pointer-events-none">
        </div>
      </main>

      <div className="hidden md:block grow h-screen min-w-0 shrink-0"></div>

      <MobileNav />
      <PostFab onCompose={() => setComposerOpen(true)} />
      <ComposerModal open={composerOpen} onClose={() => setComposerOpen(false)} />
    </div>
  );
}
