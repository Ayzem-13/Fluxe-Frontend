import { useState } from "react";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { PostFab } from "@/components/layout/PostFab";
import { ComposerModal } from "@/components/layout/ComposerModal";
import { useWindowWidth } from "@/hooks/useWindowWidth";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [composerOpen, setComposerOpen] = useState(false);
  const width = useWindowWidth();
  const marginLeft = width >= 1024 ? "ml-64" : width >= 768 ? "ml-16" : "";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DesktopSidebar onCompose={() => setComposerOpen(true)} />

      <main className={`flex-1 ${marginLeft} overflow-y-auto pb-20 md:pb-0`}>
        {children}
      </main>

      <MobileNav />
      <PostFab onCompose={() => setComposerOpen(true)} />
      <ComposerModal open={composerOpen} onClose={() => setComposerOpen(false)} />
    </div>
  );
}
