"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import {
  faPhone,
  faVideoCamera,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ContactMessageHeader = () => {
    const [isMoreInfoExpanded, setIsMoreInfoExpanded] = useState<boolean>(false)

  return (
    <section className="flex flex-row justify-between m-auto size-full ">
      <div className="w-[33%] py-[20px] flex flex-row pl-[10px] max-sm:w-[50%]">
        <div className="min-w-[74px] flex flex-col justify-center mr-[8px]">
          <Image
            src="/assets/images/profile-pic.jpg"
            alt="contact's image"
            width={60}
            height={60}
            className="w-[50px] h-[50px] rounded-full max-sm:w-[40px] max-sm:h-[40px] cursor-pointer"
          />
        </div>
        <div className="h-full flex flex-col justify-between max-w-[calc(100%-82px)]">
          <p className="font-bold text-gray-4 truncate cursor-pointer">
            Username asfgasdfsadf
          </p>
          <p className="text-gray-5 cursor-pointer">Online</p>
        </div>
      </div>
      <div className="w-fit h-full flex flex-col justify-center">
        <div className="h-fit flex flex-row justify-between mr-[8px]">
          <FontAwesomeIcon
            icon={faPhone}
            className="text-gray-5 text-[24px] hover:text-gray-4 cursor-pointer mx-[10px] m-auto"
            onClick={() => {}}
          />
          <FontAwesomeIcon
            icon={faVideoCamera}
            className="text-gray-5 text-[28px] hover:text-gray-4 cursor-pointer mx-[10px] m-auto"
            onClick={() => {}}
          />
          <div className={cn("w-[38px] h-[38px] rounded-full flex justify-center hover:bg-dark-1", isMoreInfoExpanded && "bg-dark-1")}>
            <FontAwesomeIcon
              icon={faEllipsis}
              className={cn("text-gray-5 text-[30px] cursor-pointer mx-[10px] m-auto ", isMoreInfoExpanded && "text-gray-4")}
              onClick={() => setIsMoreInfoExpanded(!isMoreInfoExpanded)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMessageHeader;
