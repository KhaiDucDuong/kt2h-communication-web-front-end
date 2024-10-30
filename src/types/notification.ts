import { z } from "zod";
import { FriendRequest, friendRequestSchema } from "./friendrequest";
import { InvitationNotificationResponse } from "./response";

export interface InvitationNotification {
  id: string;
  sent_date_time: number;
  type: InvitationNotificationType;
  friend_request: FriendRequest;
}

export interface SocketInvitationNotification {
  socket_event: NotificationSocketEvent;
  invitation_notification: InvitationNotification;
}

export enum NotificationSocketEvent {
  RECEIVE_FRIEND_REQUEST = "RECEIVE_FRIEND_REQUEST",
  RECEIVER_ACCEPT_FRIEND_REQUEST = "RECEIVER_ACCEPT_FRIEND_REQUEST",
  SENDER_DELETE_FRIEND_REQUEST = "SENDER_DELETE_FRIEND_REQUEST",
}

export enum InvitationNotificationType {
  FRIEND_REQUEST_ACCEPTED = "FRIEND_REQUEST_ACCEPTED",
  FRIEND_REQUEST_RECEIVED = "FRIEND_REQUEST_RECEIVED",
  GROUP_INVITATION_ACCEPTED = "GROUP_INVITATION_ACCEPTED",
  GROUP_INVITATION_RECEIVED = "GROUP_INVITATION_RECEIVED",
}

export const invitationNotificationSchema: z.ZodType<InvitationNotification> =
  z.object({
    id: z.string().uuid(),
    sent_date_time: z.number(),
    friend_request: friendRequestSchema,
    type: z.nativeEnum(InvitationNotificationType),
  });

export const socketInvitationNotificationSchema: z.ZodType<SocketInvitationNotification> =
  z.object({
    socket_event: z.nativeEnum(NotificationSocketEvent),
    invitation_notification: invitationNotificationSchema,
  });

export function getInvitationNotificationsFromResponse(
  response: InvitationNotificationResponse
): InvitationNotification[] {
  const notificationList = <InvitationNotification[]>[];

  for (const notificationResponse of response.data.result) {
    try {
      const validatedNotification =
        invitationNotificationSchema.parse(notificationResponse);
    } catch (e) {
      console.log(e);
      return [];
    }
    notificationList.push(notificationResponse);
  }

  return notificationList;
}
