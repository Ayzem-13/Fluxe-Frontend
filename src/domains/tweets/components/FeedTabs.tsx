import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setSort, fetchTweets } from "@/domains/tweets/slice";
import type { AppDispatch, RootState } from "@/app/store";
import type { FeedSort } from "@/domains/tweets/types";

const TABS: { label: string; value: FeedSort; disabled?: boolean }[] = [
  { label: "Récents", value: "recent" },
  { label: "Tendances", value: "trending" },
  { label: "Abonnements", value: "following", disabled: true },
];

export function FeedTabs() {
  const dispatch = useDispatch<AppDispatch>();
  const sort = useSelector((state: RootState) => state.tweets.sort);

  function handleChange(value: string) {
    const tab = TABS.find((t) => t.value === value);
    if (!tab || tab.disabled || tab.value === sort) return;
    dispatch(setSort(tab.value));
    dispatch(fetchTweets(undefined));
  }

  return (
    <Tabs value={sort} onValueChange={handleChange} className="w-full">
      <TabsList
        variant="line"
        className="w-full h-13.25 rounded-none border-b border-border bg-transparent p-0"
      >
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className="group/trigger flex-1 p-0 rounded-none text-[15px] transition-colors after:hidden"
          >
            <div className="w-full h-full flex items-center justify-center hover:bg-foreground/5 transition-colors">
              <div className="relative h-full flex items-center justify-center font-medium text-muted-foreground transition-colors group-data-[state=active]/trigger:font-bold group-data-[state=active]/trigger:text-foreground">
                {tab.label}
                <div className="absolute -bottom-px left-0 right-0 h-1 rounded-full bg-sky-500 opacity-0 group-data-[state=active]/trigger:opacity-100" />
              </div>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
