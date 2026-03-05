export type NotificationType = "FOLLOW" | "LIKE" | "LIKE_COMMENT" | "COMMENT" | "RETWEET";

export interface NotificationUser {
  id: string;
  username: string;
  avatar: string | null;
}

export interface NotificationTweet {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
}

export interface NotificationComment {
  id: string;
  content: string;
  tweetId: string;
}

export interface Notification {
  id: string;
  userId: string;
  fromUserId: string;
  type: NotificationType;
  tweetId: string | null;
  read: boolean;
  createdAt: string;
  fromUser: NotificationUser;
  tweet: NotificationTweet | null;
  comment: NotificationComment | null;
}

export interface NotificationsState {
  items: Notification[];
  nextCursor: string | null;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
}
