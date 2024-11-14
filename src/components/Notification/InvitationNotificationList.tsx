"use client";

import { getLastSentDisplayDateTime } from "@/services/ContactService";
import {
  revalidateIncomingFriendRequestTag,
  revalidateInvitationNotificationTag,
} from "@/services/revalidateApiTags";
import {
  getInvitationNotificationsFromResponse,
  InvitationNotification,
  InvitationNotificationType,
  NotificationSocketEvent,
} from "@/types/notification";
import { InvitationNotificationResponse } from "@/types/response";
import { revalidateTag } from "next/cache";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import ReceiveFriendRequestNotification from "./ReceiveFriendRequestNotification";
import { ScrollArea } from "../ui/scroll-area";
import AcceptFriendRequestNotification from "./AcceptFriendRequestNotification";
import { getAccessToken } from "@/services/AuthService";
import { SocketContext } from "@/types/context";
import { Skeleton } from "../ui/skeleton";
import NotificationSkeleton from "./NotificationSkeleton";

const InvitationNotificationList = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [invitationNotifications, setInvitationNotifications] = useState<
    InvitationNotification[]
  >([]);
  const notificationSocketContext = useContext(SocketContext);

  useEffect(() => {
    let ignore = false;

    const fetchInitialInvitationiNotifications = async () => {
      if (!hasMore) return;

      const res = await fetch(`/dashboard/api/notification?page=${page}`, {
        method: "GET",
      });
      const body = (await res.json()) as InvitationNotificationResponse;
      if (res.ok) {
        const fetchedNotifications =
          getInvitationNotificationsFromResponse(body);
        setIsFetching(false);
        setPage(body.data.meta.page + 1);
        setHasMore(body.data.meta.page < body.data.meta.pages);
        if (fetchedNotifications.length === 0 || ignore) return;
        setInvitationNotifications((prev) => [
          ...prev,
          ...fetchedNotifications,
        ]);
      }
    };

    fetchInitialInvitationiNotifications().then(() => setMounted(true));
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    processSocketInvitationNotificationMessages();
    // setInvitationNotifications((prev) => [...notificationSocketContext.newInvitationNotifications!, ...prev])
    // notificationSocketContext.setNewInvitationNotifications((prev)=> prev.filter((notification)=> notification.id !== ))
  }, [notificationSocketContext]);

  const fetchInvitationNotifications = async () => {
    if (!hasMore) return;

    const res = await fetch(`/dashboard/api/notification?page=${page}`, {
      method: "GET",
    });
    const body = (await res.json()) as InvitationNotificationResponse;
    if (res.ok) {
      const fetchedNotifications = getInvitationNotificationsFromResponse(body);
      if (fetchedNotifications.length === 0) return;
      setInvitationNotifications((prev) => [...prev, ...fetchedNotifications]);
      setPage(body.data.meta.page + 1);
      setHasMore(body.data.meta.page < body.data.meta.pages);
    }
  };

  const processSocketInvitationNotificationMessages = async () => {
    if (
      notificationSocketContext === null ||
      notificationSocketContext.newSocketInvitationNotifications.length === 0
    )
      return;
    const socketIntivationNotifications =
      notificationSocketContext.newSocketInvitationNotifications
        .filter(
          (socketNotifications) =>
            socketNotifications.socket_event ===
              NotificationSocketEvent.RECEIVER_ACCEPT_FRIEND_REQUEST ||
            NotificationSocketEvent.RECEIVE_FRIEND_REQUEST ||
            NotificationSocketEvent.SENDER_DELETE_FRIEND_REQUEST
        )
        .sort(
          (a, b) =>
            a.invitation_notification.sent_date_time -
            b.invitation_notification.sent_date_time
        );

    let updatedInvitationNotificationList = invitationNotifications;
    socketIntivationNotifications.forEach((socketNotification) => {
      switch (socketNotification.socket_event) {
        case NotificationSocketEvent.RECEIVE_FRIEND_REQUEST:
          updatedInvitationNotificationList.unshift(
            socketNotification.invitation_notification
          );
          break;
        case NotificationSocketEvent.RECEIVER_ACCEPT_FRIEND_REQUEST:
          updatedInvitationNotificationList.unshift(
            socketNotification.invitation_notification
          );
          break;
        case NotificationSocketEvent.SENDER_DELETE_FRIEND_REQUEST:
          updatedInvitationNotificationList =
            updatedInvitationNotificationList.filter(
              (notification) =>
                notification.id !==
                socketNotification.invitation_notification.id
            );
          break;
      }
      console.log(updatedInvitationNotificationList);
      setInvitationNotifications(updatedInvitationNotificationList);
      notificationSocketContext.setSocketNewInvitationNotifications(
        notificationSocketContext.newSocketInvitationNotifications.filter(
          (originalSocketNotification) =>
            !socketIntivationNotifications.includes(originalSocketNotification)
        )
      );
    });
  };

  if (isFetching)
    return (
      <section className="max-h-[65vh]">
        <NotificationSkeleton />
        <NotificationSkeleton />
      </section>
    );

  return (
    <section className="max-h-[65vh]">
      {invitationNotifications.length === 0 && (
        <div className="text-center py-[18px] font-bold text-gray-2">
          Nothing here yet
        </div>
      )}
      {invitationNotifications.map((notification) => {
        if (
          notification.type ===
          InvitationNotificationType.FRIEND_REQUEST_RECEIVED
        )
          return (
            <ReceiveFriendRequestNotification
              key={notification.id}
              notification={notification}
            />
          );
        else if (
          notification.type ===
          InvitationNotificationType.FRIEND_REQUEST_ACCEPTED
        ) {
          return (
            <AcceptFriendRequestNotification
              key={notification.id}
              notification={notification}
            />
          );
        }
      })}
    </section>
  );
};

export default InvitationNotificationList;
