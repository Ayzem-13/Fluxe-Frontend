import { AppLayout } from "@/components/layout/AppLayout";
import { TweetComposer } from "@/domains/tweets/components/TweetComposer";
import { TweetFeed } from "@/domains/tweets/components/TweetFeed";
import { FeedTabs } from "@/domains/tweets/components/FeedTabs";
import { FluxeLogo } from "@/components/FluxeLogo";
import { MobileSidebar } from "@/components/layout/MobileSidebar";

export default function Home() {
  return (
    <AppLayout>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="md:hidden flex items-center px-4 h-14 relative w-full pt-1">
          <MobileSidebar />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-0.5">
            <FluxeLogo className="size-7" />
          </div>
        </div>
        <FeedTabs />
      </div>

      <div className="hidden md:block border-b border-border">
        <div className="px-4">
          <TweetComposer />
        </div>
      </div>
      <TweetFeed />
    </AppLayout>
  );
}
