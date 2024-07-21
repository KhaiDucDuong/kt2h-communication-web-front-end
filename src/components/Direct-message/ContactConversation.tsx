import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import ConversationMessage from "./ConversationMessage";
import { conversationMessages } from "@/utils/constants";

const ContactConversation = () => {
  const lastMessageRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    // console.log("Message Ref: " + lastMessageRef)
    if (lastMessageRef.current !== null) {
      lastMessageRef.current.scrollIntoView();
    }
  }, [lastMessageRef]);

  return (
    <ScrollArea className="size-full p-[12px]">
      {conversationMessages.messageHistory.map(
        (messageGroup, i, { length }) => {
          //last element
          if (i + 1 === length) {
            return (
              <div ref={lastMessageRef}>
                <ConversationMessage
                  sentDateTime={messageGroup.sentDateTime}
                  fromUser={messageGroup.isSelfMessage}
                  messages={messageGroup.messages}
                  senderName={conversationMessages.toUserName}
                />
              </div>
            );
          } else {
            return (
              <div>
                <ConversationMessage
                  sentDateTime={messageGroup.sentDateTime}
                  fromUser={messageGroup.isSelfMessage}
                  messages={messageGroup.messages}
                  senderName={conversationMessages.toUserName}
                />
              </div>
            );
          }
        }
      )}
    </ScrollArea>
  );
};

export default ContactConversation;
