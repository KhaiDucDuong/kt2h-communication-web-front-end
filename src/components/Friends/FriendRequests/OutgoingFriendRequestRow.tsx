"use client";
import { getFriendRequestSentDateTime } from "@/services/ContactService";
import { FriendRequestProps } from "./FriendRequestDisplay";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const OutgoingFriendRequestRow = (props: { request: FriendRequestProps }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [cancelBtnHovered, setCancelBtnHovered] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  async function deleteFriendRequest() {
    try {
      const res = await fetch(
        `/friends/friend-requests/api?id=${props.request.id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        setIsDeleted(true)
        console.log("Response :" + data);
      }
      else{
        console.log("Response :" + JSON.stringify(data.body));
      }
      
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  return (
    <section
      className="w-[96%] h-[72px] hover:bg-dark-1 hover:rounded-[8px]
    px-[14px] self-center flex flex-row justify-between cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      {!isDeleted ? (
        <div className="relative self-center flex flex-row justify-center">
          <div
            className={cn(
              "rounded-full bg-dark-1 p-[8px] text-gray-4 hover:text-red-1",
              isHovered && "bg-dark-8"
            )}
            onMouseEnter={() => setCancelBtnHovered(true)}
            onMouseLeave={() => setCancelBtnHovered(false)}
            onClick={() => deleteFriendRequest()}
          >
            <XIcon
              className="m-auto"
              strokeWidth={1.7}
              width={24}
              height={24}
            />
          </div>
          <div
            className={cn(
              "self-center absolute top-[-125%]  left-[-11px] rounded-[6px] ",
              "p-[8px] w-[60px] text-center bg-dark-8 text-[13px] text-white invisible ",
              cancelBtnHovered && "visible"
            )}
          >
            <span>Cancel</span>
            <div
              className="absolute top-[100%] left-[calc(50%-2.5px)]
              border-l-[5px] border-x-transparent border-x-solid border-r-[5px] 
              border-t-[5px] border-t-solid border-t-dark-8"
            ></div>
          </div>
          <div></div>
        </div>
      ) : (
        <div className="self-center text-[13px] text-gray-5">
          Request Removed
        </div>
      )}
    </section>
  );
};

export default OutgoingFriendRequestRow;
