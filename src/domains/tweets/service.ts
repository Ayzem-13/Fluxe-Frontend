import { tweetsApi } from "./api";
import { extractErrorMessage } from "@/utils/errors";
import type {
  Tweet,
  FeedSort,
  CreateTweetPayload,
  UpdateTweetPayload,
  FetchTweetsResponse,
  LikeResponse,
} from "./types";

export async function getTweets(
  cursor?: string,
  limit = 20,
  sort: FeedSort = "recent"
): Promise<FetchTweetsResponse> {
  try {
    const res = await tweetsApi.getAll(cursor, limit, sort);
    const data = res.data;
    if (Array.isArray(data)) {
      return { tweets: data as Tweet[], nextCursor: null };
    }
    return data as FetchTweetsResponse;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to load tweets"));
  }
}

export async function postTweet(data: CreateTweetPayload): Promise<Tweet> {
  try {
    const res = await tweetsApi.create(data);
    return res.data as Tweet;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to publish tweet"));
  }
}

export async function editTweet(data: UpdateTweetPayload): Promise<Tweet> {
  try {
    const res = await tweetsApi.update(data);
    return res.data as Tweet;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to update tweet"));
  }
}

export async function toggleLike(id: string): Promise<LikeResponse & { tweetId: string }> {
  try {
    const res = await tweetsApi.like(id);
    return { ...(res.data as LikeResponse), tweetId: id };
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to like tweet"));
  }
}

export async function removeTweet(id: string): Promise<string> {
  try {
    await tweetsApi.remove(id);
    return id;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to delete tweet"));
  }
}

export async function retweetTweet(id: string): Promise<{
  retweeted: boolean;
  retweetsCount: number;
  tweetId: string;
  tweet?: Tweet;
  deletedRetweetId?: string;
}> {
  try {
    const res = await tweetsApi.retweet(id);
    const data = res.data as { retweeted: boolean; retweetsCount: number; tweet?: Tweet; deletedRetweetId?: string };
    return { ...data, tweetId: id };
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to retweet"));
  }
}
