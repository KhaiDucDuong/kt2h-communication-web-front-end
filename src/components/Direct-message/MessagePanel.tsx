"use client";
import { useState } from "react";
import ContactMessageHeader from "./ContactMessageHeader";
import ContactMoreInfoPanel from "./ContactMoreInfoPanel";
import Conversation from "../Conversation/Conversation";
import { Client } from "@stomp/stompjs";
import { User } from "@/types/user";
import { Contact } from "@/types/contact";
import { Message } from "@/types/message";

interface MessagePanelProps {
  contact: Contact | null;
  newConversationMessage: Message | null;
  setNewConversationMessage: (message: Message | null) => void;
}

const MessagePanel = (props: MessagePanelProps) => {
  const [isMoreInfoExpanded, setIsMoreInfoExpanded] = useState<boolean>(false);

  if (props.contact === null)
    return (
      <section className="size-full bg-dark-4 flex justify-center">
        <p className="self-center text-gray-2 text-[20px]">
          No conversation selected
        </p>
      </section>
    );

  return (
    <section className="flex flex-row size-full bg-dark-4">
      <div className="w-full">
        <div className="h-[98px]">
          <ContactMessageHeader
            contact={props.contact}
            profileHandleClick={() => {}}
            phoneHandleClick={() => {}}
            cameraHandleClick={() => {}}
            elipsisHandleClick={() =>
              setIsMoreInfoExpanded(!isMoreInfoExpanded)
            }
            isMoreInfoPannelExpanded={isMoreInfoExpanded}
          />
          <div className="relative flex  border-dark-10 border-[1px] "></div>
        </div>
        <div className="pt-[2px] size-full max-h-[calc(100vh-98px)]">
          <Conversation
            contact={props.contact}
            newConversationMessage={props.newConversationMessage}
            setNewConversationMessage={props.setNewConversationMessage}
          />
        </div>
      </div>
      <ContactMoreInfoPanel className={isMoreInfoExpanded ? "" : "hidden"} />
    </section>
  );
};

export default MessagePanel;
