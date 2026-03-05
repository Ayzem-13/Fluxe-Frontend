export interface CommentAuthor {
  id: string;
  username: string;
  avatar: string | null;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  tweetId: string;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
  likes: { userId: string }[];
  _count: { likes: number };
}

export interface CommentsState {
  byTweetId: Record<string, Comment[]>;
  isLoading: Record<string, boolean>;
  error: string | null;
}

export interface CreateCommentPayload {
  content: string;
  tweetId: string;
}

export interface UpdateCommentPayload {
  id: string;
  content: string;
}
