import { AppLayout } from "@/components/layout/AppLayout";
import { TweetComposer } from "@/domains/tweets/components/TweetComposer";
import { TweetFeed } from "@/domains/tweets/components/TweetFeed";
import { FeedTabs } from "@/domains/tweets/components/FeedTabs";

export default function Home() {
  return (
    <AppLayout>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <FeedTabs />
      </div>

      <div className="hidden md:block border-b border-border">
        <TweetComposer />
      </div>
      <TweetFeed />
    </AppLayout>
  );
}
