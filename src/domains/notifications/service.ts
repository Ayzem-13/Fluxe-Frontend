import { notificationsApi } from "./api";
import { extractErrorMessage } from "@/utils/errors";
import type { Notification } from "@/domains/notifications/types";

export async function getNotifications(cursor?: string, limit = 20) {
  try {
    const res = await notificationsApi.getAll(cursor, limit);
    return res.data as { notifications: Notification[]; nextCursor: string | null };
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Impossible de charger les notifications"));
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const res = await notificationsApi.markAsRead(notificationId);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Impossible de marquer comme lu"));
  }
}
