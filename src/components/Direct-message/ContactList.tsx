"use client"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Contact from "./Contact";
import { contacts } from "@/utils/constants";
import { useState } from "react";

const ContactList = () => {
  const [selectedContactId, setSelectedContactId] = useState<number>()

  return (
    <ScrollArea className="size-full">
      {
        contacts.map( (contact) => {
          return <Contact key={contact.id} image={contact.image} username={contact.username}
          noMissedMessages={contact.noMissedMessages}
          isLastMessageFromUser={contact.isLastMessageFromUser}
          lastMessage={contact.lastMessage} lastSent={contact.lastSent} className={selectedContactId===contact.id ? "bg-dark-1 rounded-[8px]" : ""}
          handleClick={() => setSelectedContactId(contact.id)}/>
        })
      }
      <ScrollBar className="custom-scrollbar"/>
    </ScrollArea>
  );
};

export default ContactList;
