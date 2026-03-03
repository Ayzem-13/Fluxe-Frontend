import type { Tweet } from "@/domains/tweets/types";

export interface UserProfile {
  id: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  isFollowing: boolean;
  _count: {
    followers: number;
    following: number;
    tweets: number;
  };
}

export interface UserProfileState {
  profile: UserProfile | null;
  tweets: Tweet[];
  nextCursor: string | null;
  isLoading: boolean;
  isFollowLoading: boolean;
  error: string | null;
}

export interface FollowResponse {
  following: boolean;
  followersCount: number;
}
