"use client"
import { getLastSentDisplayDateTime } from "@/services/ContactService";
import { ContactProps, contactRowSchema } from "@/types/contact";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";


const ContactComponent = (props: ContactProps) => {
  let displayLastSent = ""
  try {
    const validatedContactProps = contactRowSchema.parse(props);
    // if(props.lastSent !== undefined){
    //   displayLastSent = getLastSentDisplayDateTime(props.lastSent)
    // }
      
  } catch (e) {
    console.log(e);
    return;
  }

  return (
    <section
      className={cn("h-[70px] bg-dark-9 hover:bg-dark-1 hover:rounded-[8px] p-[10px] ",
    "flex flex-row justify-between max-w-[472px] cursor-pointer mb-[2px]", props.className)}
    onClick={props.handleClick}
    >
      <div
        className=" w-[77%] h-full
        flex flex-row justify-start max-w-[355px]"
      >
        <div className="flex flex-col justify-center mr-[6px]">
          <Image
            src={props.image ? props.image : "/assets/images/profile-pic.jpg"}
            alt="contact's image"
            width={50}
            height={50}
            className="w-[50px] h-[50px] rounded-full"
          />
        </div>
        <div className="ml-[4px] flex flex-col justify-between w-full max-w-[calc(100%-86px)]">
          <p className="text-gray-2 text-[16px] text-nowrap text-ellipsis overflow-hidden">{props.name}</p>
          <p className="truncate text-gray-3 text-[13px]">
            {/* {props.isLastMessageFromUser === true && "You: "}
            {props.lastMessage} */}
            Hello there
          </p>
        </div>
      </div>
      <div
        className="min-w-[15%] h-full 
      flex flex-col justify-between pb-[5px]"
      >
        <p className="text-gray-3 text-right text-[13px]">
          {/* {displayLastSent} */}
          11:00 AM
        </p>
        <Badge className="flex justify-center w-fit
        self-end bg-red-1 hover:bg-red-1 text-[12px]">{1}</Badge>
        {/* {props.noMissedMessages > 0 && <Badge className="flex justify-center w-fit
        self-end bg-red-1 hover:bg-red-1 text-[12px]">{props.noMissedMessages}</Badge>} */}
      </div>
    </section>
  );
};

export default ContactComponent;
