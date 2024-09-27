"use client";

import { SocketContext } from "@/app/dashboard/page";
import { getLastSentDisplayDateTime } from "@/services/ContactService";
import { revalidateIncomingFriendRequestTag, revalidateInvitationNotificationTag } from "@/services/revalidateApiTags";
import {
  getInvitationNotificationsFromResponse,
  InvitationNotification,
} from "@/types/notification";
import { InvitationNotificationResponse } from "@/types/response";
import { revalidateTag } from "next/cache";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

const InvitationNotificationList = () => {
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
        if (fetchedNotifications.length === 0 || ignore) return;
        setInvitationNotifications((prev) => [
          ...prev,
          ...fetchedNotifications,
        ]);
        setIsFetching(false);
        setPage(body.data.meta.page + 1);
        setHasMore(body.data.meta.page < body.data.meta.pages);
      }
    };

    fetchInitialInvitationiNotifications();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if(notificationSocketContext === null || notificationSocketContext.newInvitationNotification === null) return;
    setInvitationNotifications((prev) => [notificationSocketContext.newInvitationNotification!, ...prev])
    notificationSocketContext.setNewInvitationNotification(null)
  }, [notificationSocketContext])

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

  if (isFetching)
    return (
      <div className="py-[12px] pl-[16px] pr-[8px] text-gray-2">Loading...</div>
    );

  return (
    <div>
      {invitationNotifications.map((notification) => {
        return (
          <div
            key={notification.id}
            className="py-[12px] pl-[16px] pr-[8px] flex flex-row cursor-pointer hover:bg-dark-8"
          >
            <div>
              <Image
                src={
                  notification.friend_request.sender_image !== null
                    ? notification.friend_request.sender_image
                    : "/assets/images/profile-pic.jpg"
                }
                width={100}
                height={100}
                alt={`${notification.friend_request.sender_first_name}&apos;s profile image`}
                className="w-[40px] h-[40px] rounded-full mr-[12px]"
              />
            </div>
            <div className="w-full h-fit">
              <div className="text-gray-3">
                <span className="text-gray-2">{`${notification.friend_request.sender_last_name} ${notification.friend_request.sender_first_name}`}</span>{" "}
                sent you a friend request.
              </div>
              <div className="text-gray-3 text-[12px]">
                {getLastSentDisplayDateTime(
                  new Date(notification.sent_date_time * 1000)
                )}
              </div>
              <div className="flex flex-row mt-[2px]">
                <button className="mr-[12px] px-[16px] py-[7px] bg-green-700 hover:bg-green-800 transition rounded-[3px] text-white text-[14px]">
                  Accept
                </button>
                <button className="px-[16px] py-[7px] bg-gray-9 hover:bg-gray-10 text-white rounded-[3px] transition text-[14px]">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvitationNotificationList;
