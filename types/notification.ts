import type { Profile } from "@/types/profile";

export type NotificationType =
  | "like"
  | "comment"
  | "follow";

export type Notification = {
  id: string;
  recipientId: string;
  actorId: string;
  type: NotificationType;
  postId: string | null;
  isRead: boolean;
  createdAt: string;
};

export type NotificationWithActor = {
  notification: Notification;
  actor: Profile | null;
};