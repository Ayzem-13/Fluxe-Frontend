export interface TweetAuthor {
  id: string;
  username: string;
  avatar: string | null;
}

export interface Tweet {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: TweetAuthor;
  likes: { userId: string }[];
  _count: { likes: number };
}

export type FeedSort = "recent" | "trending" | "following";

export interface TweetsState {
  items: Tweet[];
  nextCursor: string | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  hasFetched: boolean;
  sort: FeedSort;
}

export interface CreateTweetPayload {
  content: string;
}

export interface UpdateTweetPayload {
  id: string;
  content: string;
}

export interface FetchTweetsResponse {
  tweets: Tweet[];
  nextCursor: string | null;
}

export interface LikeResponse {
  liked: boolean;
  likesCount: number;
}
