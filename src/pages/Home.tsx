import { useState } from "react";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { PostFab } from "@/components/layout/PostFab";
import { ComposerModal } from "@/components/layout/ComposerModal";
import { TweetComposer } from "@/domains/tweets/components/TweetComposer";
import { TweetFeed } from "@/domains/tweets/components/TweetFeed";
import { useWindowWidth } from "@/hooks/useWindowWidth";

export default function Home() {
  const [composerOpen, setComposerOpen] = useState(false);
  const width = useWindowWidth();
  const marginLeft = width >= 1024 ? "ml-64" : width >= 768 ? "ml-16" : "";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DesktopSidebar onCompose={() => setComposerOpen(true)} />

      <main className={`flex-1 ${marginLeft} overflow-y-auto pb-20 md:pb-0`}>
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
          <h1 className="text-xl font-bold">Accueil</h1>
        </div>

        <div className="hidden md:block border-b border-border">
          <TweetComposer />
        </div>
        <TweetFeed />
      </main>

      <MobileNav />
      <PostFab onCompose={() => setComposerOpen(true)} />
      <ComposerModal open={composerOpen} onClose={() => setComposerOpen(false)} />
    </div>
  );
}
