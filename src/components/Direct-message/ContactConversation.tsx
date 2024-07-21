import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import ConversationMessage from "./ConversationMessage";

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
      <div>
        <ConversationMessage />
      </div>
      <div>
        <ConversationMessage />
      </div>
      <div>
        <ConversationMessage />
      </div>
      <div>
        <ConversationMessage />
      </div>
      <div>
        <ConversationMessage />
      </div>
      <div>
        <ConversationMessage />
      </div>
      <div>
        <ConversationMessage />
      </div>
      <div>
        <ConversationMessage />
      </div>
      <div ref={lastMessageRef}>
        <ConversationMessage />
      </div>
    </ScrollArea>
  );
};

export default ContactConversation;
