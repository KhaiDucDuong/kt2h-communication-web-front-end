"use client"
import { useState } from "react";
import ContactMessageHeader from "./ContactMessageHeader";
import ContactMoreInfoPanel from "./ContactMoreInfoPanel";
import Conversation from "../Conversation/Conversation";
import { Client } from "@stomp/stompjs";
import { User } from "@/types/user";

interface MessagePanelProps {
  stompClient: Client
  currentUser: User
}

const MessagePanel = (props: MessagePanelProps) => {
  const [isMoreInfoExpanded, setIsMoreInfoExpanded] = useState<boolean>(false)

  return (
    <section className="flex flex-row size-full bg-dark-4">
      <div className="w-full">
        <div className="h-[98px]">
          <ContactMessageHeader profileHandleClick={()=> {}}
            phoneHandleClick={()=> {}}
            cameraHandleClick={()=> {}}
            elipsisHandleClick={() => setIsMoreInfoExpanded(!isMoreInfoExpanded)}
            isMoreInfoPannelExpanded={isMoreInfoExpanded}/>
          <div className="relative flex  border-dark-10 border-[1px] "></div>
        </div>
        <div className="pt-[2px] size-full max-h-[calc(100vh-98px)]">
          <Conversation stompClient={props.stompClient} currentUser={props.currentUser} />
        </div>
      </div>
      <ContactMoreInfoPanel className={isMoreInfoExpanded ? "" : "hidden"}/>
    </section>
  );
};

export default MessagePanel;
