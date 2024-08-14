"use client";
import { getFriendRequestSentDateTime } from "@/services/ContactService";
import { FriendRequestProps, RequestStatus } from "./FriendRequestDisplay";
import Image from "next/image";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CustomButton from "../CustomButton";

const IncomingFriendRequestRow = (props: { request: FriendRequestProps }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [status, setStatus] = useState<RequestStatus>(props.request.status);

  async function updateRequestStatus(newStatus: RequestStatus) {
    try {
      const res = await fetch(
        `/friends/friend-requests/api?id=${
          props.request.id
        }&status=${newStatus.toString()}`,
        {
          method: "PUT",
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        setStatus(newStatus);
        console.log("Response :" + data);
      } else {
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
              props.request.sender_image !== null
                ? props.request.sender_image
                : "/assets/images/profile-pic.jpg"
            }
            alt={
              props.request.sender_first_name +
              " " +
              props.request.sender_last_name +
              "s profile pic"
            }
            width={50}
            height={50}
            className="rounded-full mr-[10px]"
          />
        </div>
        <div className="self-center">
          <p className="text-gray-4 font-bold">
            {props.request.sender_first_name +
              " " +
              props.request.sender_last_name}
          </p>
          <p className="text-gray-5">
            {"Sent at: " +
              getFriendRequestSentDateTime(props.request.sent_date_time * 1000)}
          </p>
        </div>
      </div>

      {status === RequestStatus.PENDING && (
        <div className="self-center flex flex-row">
          <CustomButton
            isHovered={isHovered}
            iconComponent={XIcon}
            text="Cancel"
            hoverColor="red-1"
            onClick={() => {
              updateRequestStatus(RequestStatus.REJECTED);
            }}
          />
          <div className="w-[15px]"></div>
          <CustomButton
            isHovered={isHovered}
            iconComponent={CheckIcon}
            text="Accept"
            hoverColor="green-400"
            onClick={() => {
              updateRequestStatus(RequestStatus.ACCEPTED);
            }}
          />
        </div>
      )}
      {status === RequestStatus.ACCEPTED && (
        <div className="self-center text-[13px] text-gray-5">
          Accepted Request
        </div>
      )}
      {status === RequestStatus.REJECTED && (
        <div className="self-center text-[13px] text-gray-5">
          Deleted Request
        </div>
      )}
    </section>
  );
};

export default IncomingFriendRequestRow;
