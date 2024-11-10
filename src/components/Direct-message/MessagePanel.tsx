"use client";
import { useContext, useEffect, useState } from "react";
import ContactMessageHeader from "./ContactMessageHeader";
import ContactMoreInfoPanel from "./ContactMoreInfoPanel";
import Conversation from "../Conversation/Conversation";
import { Client } from "@stomp/stompjs";
import {
  StatusUpdate,
  statusUpdateSchema,
  User,
  UserStatus,
} from "@/types/user";
import { Contact } from "@/types/contact";
import { Message } from "@/types/message";
import { SocketContext } from "@/types/context";

interface MessagePanelProps {
  contact: Contact;
  newConversationMessage: Message | null;
  setNewConversationMessage: (message: Message | null) => void;
}

const MessagePanel = (props: MessagePanelProps) => {
  const [isMoreInfoExpanded, setIsMoreInfoExpanded] = useState<boolean>(false);
  const [conversationPartnerStatus, setConversationPartnerStatus] =
    useState<UserStatus | null>(null);
  const socketContext = useContext(SocketContext);

  useEffect(() => {
    let subscribeId: string;
    if (!socketContext || !socketContext.stompClient?.connected) {
      console.log(
        "Socket context is undefined or stomp connection hasn't established"
      );
      return;
    }

    function subscribeToConversationPartner(
      contact: Contact,
      stompClient: Client
    ) {
      subscribeId = stompClient.subscribe(
        "/user/" + contact.to_user_id + "/status",
        onConversationPartnerStatusUpdate
      ).id;
      console.log(
        "Successfully subscribe to " + "/user/" + contact.to_user_id + "/status"
      );
    }

    subscribeToConversationPartner(props.contact, socketContext.stompClient);
    setConversationPartnerStatus(props.contact.to_user_status);

    return () => {
      setConversationPartnerStatus(null);
      if (!socketContext || !socketContext.stompClient?.connected) return;
      socketContext?.stompClient?.unsubscribe(subscribeId);
      console.log(
        "Successfully unsubscribe to " +
          "/user/" +
          props.contact.to_user_id +
          "/status"
      );
    };
  }, [props.contact]);

  function onConversationPartnerStatusUpdate(payload: any) {
    const statusUpdate = JSON.parse(payload.body) as StatusUpdate;
    console.log("Receive a status update");
    // console.log(JSON.stringify(payload.body));
    try {
      const validatedStatusUpdate =
      statusUpdateSchema.parse(statusUpdate);
    } catch (error) {
      console.log("Invalid status update payload");
      return;
    }

    if (statusUpdate.user_id === props.contact.to_user_id) {
      console.log(
        "Updating conversation partner status " +
          statusUpdate.status +
          " " +
          statusUpdate.last_activity_at
      );
      setConversationPartnerStatus(statusUpdate.status);
    }
  }

  if(!conversationPartnerStatus) return <section className="flex flex-row size-full bg-dark-4"></section>

  return (
    <section className="flex flex-row size-full bg-dark-4">
      <div className="w-full">
        <div className="h-[98px]">
          <ContactMessageHeader
            contact={props.contact}
            contactStatus={conversationPartnerStatus}
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
