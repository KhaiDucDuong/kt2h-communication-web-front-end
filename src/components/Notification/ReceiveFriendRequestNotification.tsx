"use client";
import { getLastSentDisplayDateTime } from "@/services/ContactService";
import { revalidateInvitationNotificationTag } from "@/services/revalidateApiTags";
import { FriendRequestStatus } from "@/types/friendrequest";
import { InvitationNotification } from "@/types/notification";
import Image from "next/image";
import { useState } from "react";

interface ReceiveFriendRequestNotificationProps {
  notification: InvitationNotification;
}

const ReceiveFriendRequestNotification = (
  props: ReceiveFriendRequestNotificationProps
) => {
  const { notification } = props;
  const [status, setStatus] = useState<FriendRequestStatus>(
    notification.friend_request.status
  );

  async function updateRequestStatus(newStatus: FriendRequestStatus) {
    try {
      const res = await fetch(
        `/dashboard/api/friend-request?id=${
          notification.friend_request.id
        }&status=${newStatus.toString()}`,
        {
          method: "PUT",
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        setStatus(newStatus);
        console.log("Response :" + data);
        if (newStatus === FriendRequestStatus.REJECTED) {
          revalidateInvitationNotificationTag();
        }
      } else {
        console.log("Response :" + JSON.stringify(data.body));
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  }

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
        {status === FriendRequestStatus.PENDING && (
          <div className="text-gray-3">
            <span className="text-gray-2">{`${notification.friend_request.sender_last_name} ${notification.friend_request.sender_first_name}`}</span>{" "}
            sent you a friend request.
          </div>
        )}
        {status ===
          FriendRequestStatus.ACCEPTED && (
          <div className="text-gray-3">
            You accepted{" "}
            <span className="text-gray-2">{`${notification.friend_request.sender_last_name} ${notification.friend_request.sender_first_name}`}</span>{" "}
            &apos;s friend request.
          </div>
        )}
        {status ===
          FriendRequestStatus.REJECTED && (
          <div className="text-gray-3">
            You rejected{" "}
            <span className="text-gray-2">{`${notification.friend_request.sender_last_name} ${notification.friend_request.sender_first_name}`}</span>
            &apos;s friend request.
          </div>
        )}

        <div className="text-gray-3 text-[12px]">
          {getLastSentDisplayDateTime(
            new Date(notification.sent_date_time * 1000)
          )}
        </div>
        {status === FriendRequestStatus.PENDING && (
          <div className="flex flex-row mt-[2px]">
            <button
              className="mr-[12px] px-[16px] py-[7px] bg-green-700 hover:bg-green-800 transition rounded-[3px] text-white text-[14px]"
              onClick={() => {
                updateRequestStatus(FriendRequestStatus.ACCEPTED);
              }}
            >
              Accept
            </button>
            <button
              className="px-[16px] py-[7px] bg-gray-9 hover:bg-gray-10 text-white rounded-[3px] transition text-[14px]"
              onClick={() => {
                updateRequestStatus(FriendRequestStatus.REJECTED);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiveFriendRequestNotification;
