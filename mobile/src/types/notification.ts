export type NotificationType =
  | "like"
  | "comment"
  | "follow";

export type Notification = {
  id: string;
  recipientId: string;
  actorId: string;
  type:
    NotificationType;
  postId:
    | string
    | null;
  isRead: boolean;
  createdAt: string;
};

export type NotificationActor = {
  id: string;
  username:
    | string
    | null;
  avatarUrl:
    | string
    | null;
};

export type NotificationWithActor = {
  notification:
    Notification;
  actor:
    | NotificationActor
    | null;
};
