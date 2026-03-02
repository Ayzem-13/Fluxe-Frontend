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

/**
 * Fetches a paginated list of tweets.
 * Normalizes the response: backend may return a raw array or { tweets, nextCursor }.
 */
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

/** Toggles like on a tweet. Returns the new like state and count. */
export async function toggleLike(id: string): Promise<LikeResponse & { tweetId: string }> {
  try {
    const res = await tweetsApi.like(id);
    return { ...(res.data as LikeResponse), tweetId: id };
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to like tweet"));
  }
}

/** Deletes a tweet and returns its id so the store can remove it. */
export async function removeTweet(id: string): Promise<string> {
  try {
    await tweetsApi.remove(id);
    return id;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to delete tweet"));
  }
}
