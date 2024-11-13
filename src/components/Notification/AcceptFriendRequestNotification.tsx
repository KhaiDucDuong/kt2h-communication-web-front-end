import { getLastSentDisplayDateTime } from "@/services/ContactService";
import { InvitationNotification } from "@/types/notification";
import Image from "next/image";

interface AcceptFriendRequestNotificationProps {
  notification: InvitationNotification;
}

const AcceptFriendRequestNotification = (
  props: AcceptFriendRequestNotificationProps
) => {
  const { notification } = props;
  return (
    <div
      key={notification.id}
      className="py-[12px] pl-[16px] pr-[8px] flex flex-row cursor-pointer hover:bg-dark-8"
    >
      <div>
        <Image
          src={
            notification.friend_request.receiver_image !== null
              ? notification.friend_request.receiver_image
              : "/assets/images/profile-pic.jpg"
          }
          width={100}
          height={100}
          alt={`${notification.friend_request.receiver_image}&apos;s profile image`}
          className="w-[40px] h-[40px] rounded-full mr-[12px]"
        />
      </div>
      <div className="w-full h-fit">
        <div className="text-gray-3">
          <span className="text-gray-2">{`${notification.friend_request.receiver_last_name} ${notification.friend_request.receiver_first_name}`}</span>{" "}
          has accepted your friend request.
        </div>
        <div className="text-gray-3 text-[12px]">
          {getLastSentDisplayDateTime(
            new Date(notification.sent_date_time * 1000)
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptFriendRequestNotification;
