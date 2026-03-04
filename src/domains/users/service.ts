import { usersApi } from "./api";
import { extractErrorMessage } from "@/utils/errors";
import type { UserProfile, FollowResponse } from "./types";
import type { FetchTweetsResponse } from "@/domains/tweets/types";

export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const res = await usersApi.getProfile(userId);
    return res.data as UserProfile;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Erreur lors du chargement du profil"));
  }
}

export async function getUserTweets(
  userId: string,
  cursor?: string,
  limit = 20
): Promise<FetchTweetsResponse> {
  try {
    const res = await usersApi.getTweets(userId, cursor, limit);
    return res.data as FetchTweetsResponse;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Erreur lors du chargement des tweets"));
  }
}

export async function toggleUserFollow(userId: string): Promise<FollowResponse> {
  try {
    const res = await usersApi.toggleFollow(userId);
    return res.data as FollowResponse;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Erreur lors du suivi"));
  }
}
