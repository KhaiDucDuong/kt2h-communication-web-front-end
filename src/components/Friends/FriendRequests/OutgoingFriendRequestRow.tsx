import { getFriendRequestSentDateTime } from "@/services/ContactService";
import { FriendRequestProps } from "./FriendRequestDisplay";
import Image from "next/image";

const OutgoingFriendRequestRow = (props: { request: FriendRequestProps }) => {
  return (
    <section
      className="w-[96%] h-[72px] hover:bg-dark-1 hover:rounded-[8px]
    px-[14px] self-center flex flex-row justify-between cursor-pointer relative"
    >
      <div className="w-[calc(100%-28px)] h-[1px] absolute border-t-[1px] border-dark-1"></div>
      <div className="flex flex-row">
        <div className="self-center">
          <Image
            src={
              props.request.receiver_image !== null
                ? props.request.receiver_image
                : "/assets/images/profile-pic.jpg"
            }
            alt={
              props.request.receiver_first_name +
              " " +
              props.request.receiver_last_name +
              "s profile pic"
            }
            width={50}
            height={50}
            className="rounded-full mr-[10px]"
          />
        </div>
        <div className="self-center">
          <p className="text-gray-4 font-bold">
            {props.request.receiver_first_name +
              " " +
              props.request.receiver_last_name}
          </p>
          <p className="text-gray-5">
            {"Sent at: " +
              getFriendRequestSentDateTime(props.request.sent_date_time * 1000)}
          </p>
        </div>
      </div>
      <div className="self-center flex flex-row">
        <div>Cancel</div>
      </div>
    </section>
  );
};

export default OutgoingFriendRequestRow;
