"use client";
import Image from "next/image";
import { useState } from "react";
import CustomButton from "../CustomButton";
import { EllipsisVerticalIcon, MessageCircleIcon } from "lucide-react";

const FriendRow = (props: {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  status: string;
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
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
              props.image !== null
                ? props.image
                : "/assets/images/profile-pic.jpg"
            }
            alt={props.firstName + " " + props.lastName + "s profile pic"}
            width={50}
            height={50}
            className="rounded-full mr-[10px] size-[50px]"
          />
        </div>
        <div className="self-center">
          <p className="text-gray-4 font-bold">
            {props.firstName + " " + props.lastName}
          </p>
          <p className="text-gray-5">{props.status}</p>
        </div>
      </div>
      <div className="self-center flex flex-row">
        <CustomButton
          isHovered={isHovered}
          iconComponent={MessageCircleIcon}
          text="Message"
          hoverColor="white"
          filled={true}
          onClick={() => {}}
        />
        <div className="w-[15px]"></div>
        <CustomButton
          isHovered={isHovered}
          iconComponent={EllipsisVerticalIcon}
          text="More"
          hoverColor="white"
          filled={false}
          onClick={() => {}}
        />
      </div>
    </section>
  );
};

export default FriendRow;
