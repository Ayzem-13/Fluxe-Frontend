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

export async function getUserRetweets(
  userId: string,
  cursor?: string,
  limit = 20
): Promise<FetchTweetsResponse> {
  try {
    const res = await usersApi.getRetweets(userId, cursor, limit);
    return res.data as FetchTweetsResponse;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Erreur lors du chargement des retweets"));
  }
}

export async function updateUserProfile(data: {
  username?: string;
  bio?: string;
  avatar?: string | null;
}): Promise<{ id: string; username: string; avatar: string | null; bio: string | null }> {
  try {
    const res = await usersApi.updateMe(data);
    return res.data as { id: string; username: string; avatar: string | null; bio: string | null };
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Erreur lors de la mise à jour du profil"));
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
