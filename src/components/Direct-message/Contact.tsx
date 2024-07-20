"use client"
import { getLastSentDisplayDateTime } from "@/services/ContactService";
import { ContactProps, contactPropsSchema } from "@/types/contact";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { Badge } from "../ui/badge";


const Contact = (props: ContactProps) => {
  let displayLastSent = ""
  try {
    const validatedContactProps = contactPropsSchema.parse(props);
    console.log(validatedContactProps)
    if(props.lastSent !== undefined){
      displayLastSent = getLastSentDisplayDateTime(props.lastSent)
    }
      
  } catch (e) {
    console.log(e);
    return;
  }

  return (
    <section
      className="h-[100px] x-full bg-dark-9 hover:bg-dark-1 hover:rounded-[8px] p-[10px]
    flex flex-row justify-between max-w-[472px] cursor-pointer"
    >
      <div
        className=" w-[77%] h-full
        flex flex-row justify-start max-w-[355px]"
      >
        <div className="flex flex-col justify-center mr-[6px]">
          <Image
            src={props.image}
            alt="contact's image"
            width={50}
            height={50}
            className="w-[80px] h-[80px] rounded-full max-sm:w-[60px] max-sm:h-[60px]"
          />
        </div>
        <div className="flex flex-col justify-between w-full max-w-[calc(100%-86px)]">
          <p className="text-gray-2 text-[24px]">{props.username}</p>
          <p className="truncate text-gray-3 text-[20px]">
            {props.isLastMessageFromUser === true && "You: "}
            {props.lastMessage}
          </p>
        </div>
      </div>
      <div
        className="min-w-[15%] h-full 
      flex flex-col justify-between pb-[5px]"
      >
        <p className="text-gray-3 text-right">
          {displayLastSent}
        </p>
        {props.noMissedMessages > 0 && <Badge className="flex justify-center w-fit 
        self-end bg-red-1 hover:bg-red-1">{props.noMissedMessages}</Badge>}
      </div>
    </section>
  );
};

export default Contact;
