"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import {
  faPhone,
  faVideoCamera,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Contact } from "@/types/contact";
import { getStatusUpdateFromResponse, UserStatus } from "@/types/user";
import { UserStatusReponse } from "@/types/response";

interface ContactMessageHeaderProps {
  profileHandleClick: () => void;
  phoneHandleClick: () => void;
  cameraHandleClick: () => void;
  elipsisHandleClick: () => void;
  isMoreInfoPannelExpanded: boolean;
  contact: Contact;
  contactStatus: UserStatus;
}

const ContactMessageHeader = (props: ContactMessageHeaderProps) => {
  const { contact } = props;
  const [contactStatus, setContactStatus] = useState<UserStatus | null>(
    contact.to_user_status
  );

  useEffect(() => {
    let ignore = false;

    async function fetchContactStatus() {
      const res = await fetch(
        `/dashboard/api/contact/status?id=${contact.to_user_id}`,
        {
          method: "GET",
        }
      );
      const body = (await res.json()) as UserStatusReponse;
      if (!res.ok) {
        console.log("Failed to fetch contact's status");
      } else {
        if (ignore) return;
        const statusUpdate = getStatusUpdateFromResponse(body);
        if (statusUpdate === null) return;
        console.log(statusUpdate.user_id === contact.to_user_id)
        if (statusUpdate.user_id === contact.to_user_id)
          setContactStatus(statusUpdate.status);
      }
    }

    fetchContactStatus()

    return () => {
      ignore = true;
      setContactStatus(null);
    };
  }, [contact.id]);

  return (
    <section className="flex flex-row justify-between m-auto size-full ">
      <div className="w-[33%] py-[20px] flex flex-row pl-[10px] max-xl:w-[50%]">
        <div
          className="min-w-fit flex flex-col justify-center mr-[8px]
        cursor-pointer"
        >
          <Image
            src={
              contact.to_user_image === null
                ? "/assets/images/profile-pic.jpg"
                : contact.to_user_image
            }
            alt={contact.to_user_nickname + "'s profile picture"}
            width={60}
            height={60}
            className="w-[50px] h-[50px] rounded-full max-sm:w-[40px] max-sm:h-[40px]"
          />
        </div>
        <div className="h-full flex flex-col justify-between max-w-[calc(100%-82px)]">
          <p className="mt-[4px] font-bold text-gray-4 truncate">
            {contact.to_user_nickname}
          </p>
          {contactStatus === UserStatus.OFFLINE && (
            <p className="text-gray-10">Offline</p>
          )}
          {contactStatus === UserStatus.ONLINE && (
            <p className="text-green-600">Online</p>
          )}
          {contactStatus === UserStatus.IDLE && (
            <p className="text-yellow-400">Idle</p>
          )}
          {contactStatus === UserStatus.DO_NOT_DISTURB && (
            <p className="text-red-600">Do Not Disturb</p>
          )}
        </div>
      </div>
      <div className="w-fit h-full flex flex-col justify-center">
        <div className="h-fit flex flex-row justify-between mr-[14px]">
          <FontAwesomeIcon
            icon={faPhone}
            className="text-gray-5 text-[24px] hover:text-gray-4 cursor-pointer mx-[10px] m-auto"
            onClick={props.phoneHandleClick}
          />
          <FontAwesomeIcon
            icon={faVideoCamera}
            className="text-gray-5 text-[28px] hover:text-gray-4 cursor-pointer mx-[10px] m-auto"
            onClick={props.cameraHandleClick}
          />
          <div
            className={cn(
              "w-[38px] h-[38px] rounded-full flex justify-center hover:bg-dark-1",
              props.isMoreInfoPannelExpanded && "bg-dark-1"
            )}
          >
            <FontAwesomeIcon
              icon={faEllipsis}
              className={cn(
                "text-gray-5 text-[30px] cursor-pointer mx-[10px] m-auto ",
                props.isMoreInfoPannelExpanded && "text-gray-4"
              )}
              onClick={props.elipsisHandleClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMessageHeader;
