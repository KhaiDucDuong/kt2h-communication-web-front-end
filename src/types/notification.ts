import { z } from "zod";
import { FriendRequest, friendRequestSchema } from "./friendrequest";
import { InvitationNotificationResponse } from "./response";

export interface InvitationNotification {
  id: string;
  sent_date_time: number;
  friend_request: FriendRequest;
}

export const invitationNotificationSchema: z.ZodType<InvitationNotification> =
  z.object({
    id: z.string().uuid(),
    sent_date_time: z.number(),
    friend_request: friendRequestSchema,
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
