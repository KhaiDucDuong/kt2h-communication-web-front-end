import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { conversationMessages } from "@/utils/constants";
import ConversationMessage from "../Direct-message/ConversationMessage";
import MessageBox from "./MessageBox";
import { Client } from "@stomp/stompjs";
import { User } from "@/types/user";
import { Contact } from "@/types/contact";
import { ConversationMessageResponse } from "@/types/response";
import {
  getMessagesFromResponse,
  groupMessagesFromSameSender,
  Message,
  MessageGroup,
} from "@/types/message";

interface ConversationProps {
  currentUser: User;
  contact: Contact;
  newConversationMessage: Message | null;
  setNewConversationMessage: (message: Message | null) => void;
}

const Conversation = (props: ConversationProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageGroups, setMessageGroups] = useState<MessageGroup[]>([]);
  const [messagePage, setMessagePage] = useState<number>(1);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    fetchMessages(ignore, 1, props.contact.id);

    return () => {
      ignore = true;
    };
  }, [props.contact.id]);

  useEffect(() => {
    if (props.newConversationMessage !== null) {
      setMessages((prev) => [...prev, props.newConversationMessage!]);
      if (messageGroups.length === 0) {
        setMessageGroups(
          groupMessagesFromSameSender([props.newConversationMessage!])
        );
      } else {
        const currentMessageGroup = messageGroups;
        const lastMessageGroup = messageGroups.at(-1);
        if (
          lastMessageGroup?.sender_id ===
            props.newConversationMessage.sender_id &&
          lastMessageGroup?.sentDateTime.getTime() + 1000 * 60 * 5 >
            props.newConversationMessage.sent_at
        ) {
          lastMessageGroup.messages.push(props.newConversationMessage!);
          currentMessageGroup.pop();
          currentMessageGroup.push(lastMessageGroup);
          setMessageGroups(currentMessageGroup);
        } else {
          setMessageGroups((prev) => [
            ...prev,
            ...groupMessagesFromSameSender([props.newConversationMessage!]),
          ]);
        }
        props.setNewConversationMessage(null);
      }
    }
  }, [props.newConversationMessage]);


  async function fetchMessages(ignore: boolean, messagePage: number, contactId: string) {
    const res = await fetch(
      `/dashboard/api/message?conversationId=${contactId}&page=${messagePage}`,
      {
        method: "GET",
      }
    );
    const body = (await res.json()) as ConversationMessageResponse;
    if (!res.ok) {
      console.log("Failed to fetch messages");
    } else {
      if (ignore) return;
      console.log("Messages data: ", body);
      const fetchedMessages = getMessagesFromResponse(body);
      if (fetchedMessages === null) return;
      setMessages(fetchedMessages);
      setMessageGroups(groupMessagesFromSameSender(fetchedMessages));
      setMessagePage(body.data.meta.page + 1);
      setHasMoreMessages(body.data.meta.page < body.data.meta.pages);
    }
  }

  // useEffect(() => {
  //   if (lastMessageRef.current !== null) {
  //     lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [lastMessageRef]);

  return (
    <section className="size-full flex flex-col">
      {props.contact.id}
      {" Message length: " +messages.length}
      <ScrollArea className="size-full p-[12px]">
        {messageGroups.map((messageGroup, i, { length }) => {
          //last element
          if (i === length - 1) {
            return (
              <div key={messageGroup.messages.at(0)?.id}>
                <ConversationMessage
                  sentDateTime={new Date(messageGroup.sentDateTime)}
                  fromUser={
                    messageGroup.sender_id === props.contact.requester_id
                  }
                  messages={messageGroup.messages}
                  senderName={
                    messageGroup.sender_id === props.currentUser.user_id
                      ? props.contact.requester_nickname
                      : props.contact.to_user_nickname
                  }
                  senderImage={messageGroup.sender_id === props.currentUser.user_id ? props.currentUser.image : props.contact.to_user_image}
                  isLastMessage={true}
                />
              </div>
            );
          } else {
            return (
              <div key={messageGroup.messages.at(0)?.id}>
                <ConversationMessage
                  sentDateTime={messageGroup.sentDateTime}
                  fromUser={
                    messageGroup.sender_id === props.currentUser.user_id
                  }
                  messages={messageGroup.messages}
                  senderName={
                    messageGroup.sender_id === props.currentUser.user_id
                      ? props.contact.requester_nickname
                      : props.contact.to_user_nickname
                  }
                  senderImage={messageGroup.sender_id === props.currentUser.user_id ? props.currentUser.image : props.contact.to_user_image}
                  isLastMessage={false}
                />
              </div>
            );
          }
        })}
      </ScrollArea>
      <MessageBox
        currentUser={props.currentUser}
        contactId={props.contact.id}
      />
    </section>
  );
};

export default Conversation;
