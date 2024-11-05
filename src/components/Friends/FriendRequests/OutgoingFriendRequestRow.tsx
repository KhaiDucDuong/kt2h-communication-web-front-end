"use client";
import { getFriendRequestSentDateTime } from "@/services/ContactService";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CustomButton from "../CustomButton";
import { FriendRequest } from "@/types/friendrequest";

const OutgoingFriendRequestRow = (props: { request: FriendRequest }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  async function deleteFriendRequest() {
    try {
      const res = await fetch(
        `/dashboard/api/friend-request?id=${props.request.id}`,
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
        <CustomButton isHovered={isHovered}
        iconComponent={XIcon}
        text="Cancel"
        hoverColor="red-1"
        filled={false}
        onClick={deleteFriendRequest}
        />
      ) : (
        <div className="self-center text-[13px] text-gray-5">
          Request Removed
        </div>
      )}
    </section>
  );
};

export default OutgoingFriendRequestRow;
