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

export interface TweetsState {
  items: Tweet[];
  nextCursor: string | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  hasFetched: boolean;
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
