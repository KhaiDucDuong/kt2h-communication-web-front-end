"use server";

import { revalidateTag } from "next/cache";

export async function revalidateAllTags() {
  revalidateInvitationNotificationTag();
  revalidateIncomingFriendRequestTag();
  revalidateOutgoingFriendRequestTag();
}

export async function revalidateInvitationNotificationTag() {
  revalidateTag("invitationNotifications");
  console.log("Revalidate invitationNotifications tag");
}

export async function revalidateIncomingFriendRequestTag() {
  revalidateTag("incomingFriendRequests");
  console.log("Revalidate incomingFriendRequests tag");
}

export async function revalidateOutgoingFriendRequestTag() {
  revalidateTag("outgoingFriendRequests");
  console.log("Revalidate outgoingFriendRequests tag");
}
