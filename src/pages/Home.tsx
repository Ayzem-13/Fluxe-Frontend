import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { PostFab } from "@/components/layout/PostFab";

export default function Home() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DesktopSidebar />

      <main className="flex-1 md:ml-64 overflow-y-auto pb-20 md:pb-0">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3">
          <h1 className="text-xl font-bold">Accueil</h1>
        </div>
      </main>

      <MobileNav />
      <PostFab />
    </div>
  );
}
