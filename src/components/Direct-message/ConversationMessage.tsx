import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import Image from "next/image";
import { element } from "prop-types";
import { forwardRef, MutableRefObject, SetStateAction, useEffect } from "react";

interface ConversationMessageProps {
  sentDateTime: Date;
  fromUser: boolean;
  senderName?: string;
  senderImage: string | null;
  messages: Message[];
  attachedImages?: string[];
  sticker?: string[]; //update this later
  icon?: string[]; //update this later
  isLastMessage: boolean;
}

const ConversationMessage = (props: ConversationMessageProps) => {
  useEffect(() => {
    console.log("run");
    if (props.messages !== undefined && props.isLastMessage) {
      const element = document.getElementById(
        props.messages.at(-1)!.id.toString()
      );
      if (element !== null) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [props.messages.length]);

  return (
    <section
      className={cn("flex flex-row mb-[6px] ", props.fromUser && "justify-end")}
    >
      {!props.fromUser && (
        <div className="w-[40px] mr-[10px]">
          <Image
            src={
              props.senderImage === null
                ? "/assets/images/profile-pic.jpg"
                : props.senderImage
            }
            alt={props.senderName + "'s profile picture"}
            width={50}
            height={50}
            className="w-[40px] h-[40px] rounded-full cursor-pointer"
          />
        </div>
      )}

      <div className="w-fit max-w-[70%]  flex flex-col ">
        <div
          className={cn(
            "flex flex-row mb-[5px]",
            props.fromUser && "justify-end"
          )}
        >
          <p className="text-gray-5 text-[13px]">
            {props.senderName && !props.fromUser && (
              <span className="text-gray-4 text-[16px] mr-[0.5em] cursor-pointer">
                {props.senderName}
              </span>
            )}
            {props.sentDateTime.toLocaleString("vi-VN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        {props.messages &&
          props.messages.map((message, i) => {
            return (
              <div
                key={message.id}
                id={message.id}
                className={cn(
                  "rounded-[8px] bg-gray-5 px-[12px] py-[8px] mb-[4px] w-fit ",
                  props.fromUser && "self-end"
                )}
              >
                <p className="wrap text-dark-9">{message.message}</p>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default ConversationMessage;
